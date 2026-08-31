#!/usr/bin/env bash
# Prépare le VPS à servir TiCode sur ticode.fr, en HTTPS.
#
# À lancer UNE SEULE FOIS, une fois le DNS pointé vers ce serveur :
#
#   sudo bash ~/juliendolou/deploy/setup-domain.sh ticode.fr
#
# Rejouable sans dommage : il ne recrée que ce qui manque.
#
# Le VPS sert déjà d'autres sites, via Caddy (ports 80 et 443). Ce script
# n'installe donc PAS nginx : deux reverse-proxys sur le même port se
# marcheraient dessus et tes autres sites tomberaient. Il ajoute seulement
# un bloc Caddy nommé, qui ne répond que pour ticode.fr / www.ticode.fr.
# Les autres blocs, et les sites sur 8080 / 8081, ne sont pas touchés.
# Seul l'ancien processus pm2 « juliendolou » (python http.server de CE
# site) est arrêté, une fois Caddy en mesure de le remplacer.
set -euo pipefail

DOMAIN="${1:-ticode.fr}"
ROOT=/var/www/ticode
CADDYFILE=/etc/caddy/Caddyfile
SNIPPET=/etc/caddy/sites-enabled/ticode.caddy
PM2_ANCIEN=juliendolou

[ "$(id -u)" -eq 0 ] || { echo "à lancer avec sudo" >&2; exit 1; }

echo "==> Ce qui tourne actuellement"
echo "    Ports ouverts sur l'extérieur :"
ss -ltnp 2>/dev/null | awk 'NR>1 && $4 !~ /127\.0\.0\.1|\[::1\]/ {print "      " $4 "  " $NF}'

occupant80="$(ss -ltnp 2>/dev/null | awk '$4 ~ /:80$/ {print $NF; exit}')"
echo "    Port 80 : ${occupant80:-libre}"

if ! command -v caddy >/dev/null 2>&1 || [ ! -f "$CADDYFILE" ]; then
  echo
  echo "    Caddy n'est pas là où on l'attend ($CADDYFILE)." >&2
  echo "    Ce VPS sert déjà tes autres sites avec Caddy : on s'y greffe," >&2
  echo "    on n'installe pas nginx. Envoie la sortie de :" >&2
  echo "        sudo bash ~/juliendolou/deploy/etat-vps.sh" >&2
  exit 1
fi

case "$occupant80" in
  ""|*caddy*) ;;
  *)
    echo "    Le port 80 n'est pas tenu par Caddy ($occupant80)." >&2
    echo "    On s'arrête pour ne rien casser." >&2
    exit 1
    ;;
esac

echo "==> Le DNS pointe-t-il bien ici ?"
ip_serveur="$(curl -4 -s --max-time 8 https://checkip.amazonaws.com || true)"
echo "    ce serveur -> ${ip_serveur:-inconnue}"

hosts=()
for d in "$DOMAIN" "www.$DOMAIN"; do
  ip="$(getent ahostsv4 "$d" | awk 'NR==1{print $1}' || true)"
  echo "    $d -> ${ip:-aucune réponse}"
  if [ -n "$ip_serveur" ] && [ "$ip" = "$ip_serveur" ]; then
    hosts+=("$d")
  else
    echo "      (pas encore dans le bloc : un certificat pour ce nom échouerait)"
  fi
done

if [ "${#hosts[@]}" -eq 0 ]; then
  echo
  echo "    Aucun des deux noms ne pointe ici. Chez OVH, zone DNS :" >&2
  echo "      A    (vide)    ${ip_serveur:-IP du VPS}" >&2
  echo "      A    www       ${ip_serveur:-IP du VPS}" >&2
  echo "    Attends la propagation, puis relance." >&2
  exit 1
fi

noms="${hosts[*]}"
noms="${noms// /, }"

echo "==> Sauvegarde de /etc/caddy"
sauvegarde="/root/caddy-avant-ticode-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$sauvegarde" -C /etc caddy
echo "    $sauvegarde"

echo "==> Racine web $ROOT"
mkdir -p "$ROOT"
if [ ! -s "$ROOT/index.html" ]; then
  echo '<!doctype html><meta charset="utf-8"><title>TiCode</title><p>Installation en cours.' >"$ROOT/index.html"
fi
# Caddy lit les fichiers ; www-data ou caddy, l'essentiel est qu'ils soient
# lisibles. On reste sur www-data, déjà utilisé par le déploiement.
chown -R www-data:www-data "$ROOT"
chmod -R a+rX "$ROOT"

echo "==> Bloc Caddy pour $noms"
mkdir -p /etc/caddy/sites-enabled
cat >"$SNIPPET" <<CONF
# TiCode — généré par deploy/setup-domain.sh. Ne répond que pour ces noms.
$noms {
	root * $ROOT
	encode gzip zstd
	try_files {path} {path}.html {path}/index.html
	file_server
	header Cache-Control "no-cache"
	@static path /_next/static/*
	header @static Cache-Control "public, immutable, max-age=31536000"
	handle_errors {
		rewrite * /404.html
		file_server
	}
}
CONF

# On n'ajoute l'import que s'il n'y est pas déjà, et seulement de notre
# dossier : on ne touche à aucun autre fichier de configuration.
if ! grep -q 'import /etc/caddy/sites-enabled/\*' "$CADDYFILE"; then
  printf '\n# TiCode — import des sites additionnels\nimport /etc/caddy/sites-enabled/*\n' >>"$CADDYFILE"
fi

if ! caddy validate --config "$CADDYFILE" >/tmp/caddy-validate.log 2>&1; then
  rm -f "$SNIPPET"
  echo "    configuration refusée : notre bloc est retiré, rien n'a changé" >&2
  cat /tmp/caddy-validate.log >&2
  exit 1
fi

systemctl reload caddy

echo "==> L'ancien serveur Python de ce site n'a plus lieu d'être"
if command -v pm2 >/dev/null 2>&1; then
  utilisateur="${SUDO_USER:-ubuntu}"
  if sudo -u "$utilisateur" pm2 describe "$PM2_ANCIEN" >/dev/null 2>&1; then
    sudo -u "$utilisateur" pm2 delete "$PM2_ANCIEN" >/dev/null
    sudo -u "$utilisateur" pm2 save --force >/dev/null
    echo "    « $PM2_ANCIEN » arrêté"
  else
    echo "    rien à arrêter"
  fi
  echo "    Applications pm2 restantes :"
  sudo -u "$utilisateur" pm2 list 2>/dev/null | sed 's/^/      /' || true
fi

echo
echo "==> Vérification"
for d in "${hosts[@]}"; do
  echo -n "    http://$d  -> "
  curl -sI --max-time 8 "http://$d/" | head -1 || echo "(pas de réponse)"
  echo -n "    https://$d -> "
  curl -sI --max-time 20 "https://$d/" | head -1 || echo "(certificat en cours, relance dans une minute)"
done
echo
echo "Prêt. Déploie maintenant le site :"
echo "    bash ~/juliendolou/deploy/update.sh"
echo
echo "Sauvegarde Caddy d'avant : $sauvegarde"
if [ "${#hosts[@]}" -lt 2 ]; then
  echo
  echo "Note : un des deux noms ne pointe pas encore ici. Dès que l'enregistrement"
  echo "A manquant est en place chez OVH, relance ce script : il ajoutera le nom"
  echo "et Caddy demandera le certificat tout seul."
fi
