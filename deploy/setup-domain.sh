#!/usr/bin/env bash
# Prépare le VPS à servir TiCode sur ticode.fr, en HTTPS.
#
#   sudo bash ~/juliendolou/deploy/setup-domain.sh ticode.fr
#
# Rejouable sans dommage.
#
# Tes autres sites passent par Caddy DANS DOCKER (docker-proxy sur 80/443).
# On n'installe ni nginx ni un second Caddy : on ajoute un bloc au Caddyfile
# déjà monté, qui reverse-proxifie vers python sur 8081 (déjà en place pour
# ce site). Les autres blocs ne sont pas lus, pas copiés, pas désactivés.
set -euo pipefail

DOMAIN="${1:-ticode.fr}"
PORT=8081
MARQUEUR_DEBUT="# BEGIN ticode"
MARQUEUR_FIN="# END ticode"

[ "$(id -u)" -eq 0 ] || { echo "à lancer avec sudo" >&2; exit 1; }

echo "==> Ce qui tourne actuellement"
ss -ltnp 2>/dev/null | awk 'NR>1 && $4 !~ /127\.0\.0\.1|\[::1\]/ {print "    " $4 "  " $NF}'

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
    echo "      (ignoré pour le certificat : ce nom ne pointe pas ici)"
  fi
done
if [ "${#hosts[@]}" -eq 0 ]; then
  echo "    Aucun nom ne pointe ici. Chez OVH : A vide + A www -> ${ip_serveur:-IP}" >&2
  exit 1
fi
noms="${hosts[*]}"
noms="${noms// /, }"

# Adresse à laquelle le conteneur rejoint le python du host (0.0.0.0:8081).
backend="$(ip -4 route get 1.1.1.1 2>/dev/null | awk '{for (i = 1; i <= NF; i++) if ($i == "src") { print $(i + 1); exit }}')"
backend="${backend:-172.17.0.1}:$PORT"
echo "    backend python : $backend"

echo "==> Conteneur qui tient le port 80"
if ! command -v docker >/dev/null 2>&1; then
  echo "    docker introuvable alors que docker-proxy écoute sur 80" >&2
  exit 1
fi
cid="$(docker ps -q --filter publish=80 | head -1 || true)"
if [ -z "$cid" ]; then
  echo "    aucun conteneur n'expose le port 80" >&2
  docker ps --format '    {{.Names}}\t{{.Image}}\t{{.Ports}}' >&2 || true
  exit 1
fi
cname="$(docker inspect -f '{{.Name}}' "$cid" | sed 's#^/##')"
cimage="$(docker inspect -f '{{.Config.Image}}' "$cid")"
echo "    $cname  ($cimage)"
if ! docker exec "$cid" caddy version >/dev/null 2>&1; then
  echo "    ce conteneur n'expose pas la commande caddy — ce n'est peut-être pas Caddy" >&2
  echo "    Envoie la sortie de : sudo bash ~/juliendolou/deploy/etat-vps.sh" >&2
  exit 1
fi

echo "==> Caddyfile monté depuis l'hôte"
caddyfile_hote=""
caddyfile_conteneur=""
while IFS='|' read -r type source dest; do
  [ -n "$dest" ] || continue
  echo "    $type  $source  ->  $dest"
  case "$dest" in
    */Caddyfile)
      caddyfile_conteneur="$dest"
      if [ "$type" = bind ] && [ -f "$source" ]; then
        caddyfile_hote="$source"
      fi
      ;;
    */caddy|*/caddy/|/etc/caddy|/config|/config/caddy)
      if [ -z "$caddyfile_conteneur" ]; then
        caddyfile_conteneur="${dest%/}/Caddyfile"
      fi
      if [ "$type" = bind ] && [ -f "${source%/}/Caddyfile" ]; then
        caddyfile_hote="${source%/}/Caddyfile"
        caddyfile_conteneur="${dest%/}/Caddyfile"
      fi
      ;;
  esac
done < <(docker inspect -f '{{range .Mounts}}{{.Type}}|{{.Source}}|{{.Destination}}{{"\n"}}{{end}}' "$cid")

if [ -z "$caddyfile_conteneur" ]; then
  for p in /etc/caddy/Caddyfile /config/Caddyfile /config/caddy/Caddyfile; do
    if docker exec "$cid" test -f "$p" 2>/dev/null; then
      caddyfile_conteneur="$p"
      break
    fi
  done
fi

if [ -z "$caddyfile_conteneur" ]; then
  echo "    Caddyfile introuvable dans le conteneur $cname" >&2
  echo "    Envoie la sortie de : sudo bash ~/juliendolou/deploy/etat-vps.sh" >&2
  exit 1
fi
echo "    dans le conteneur : $caddyfile_conteneur"
echo "    sur l'hôte        : ${caddyfile_hote:-non monté (édition dans le conteneur)}"

bloc="$MARQUEUR_DEBUT
# Généré par deploy/setup-domain.sh — ne répond que pour ces noms.
$noms {
	reverse_proxy $backend
}
$MARQUEUR_FIN"

ecrire_bloc() {
  local fichier="$1"
  local tmp
  tmp="$(mktemp)"
  if [ -f "$fichier" ] && grep -q "$MARQUEUR_DEBUT" "$fichier"; then
    awk -v d="$MARQUEUR_DEBUT" -v f="$MARQUEUR_FIN" '
      $0 == d { skip = 1; next }
      $0 == f { skip = 0; next }
      !skip { print }
    ' "$fichier" >"$tmp"
  elif [ -f "$fichier" ]; then
    cat "$fichier" >"$tmp"
    printf '\n' >>"$tmp"
  fi
  printf '%s\n' "$bloc" >>"$tmp"
  cat "$tmp" >"$fichier"
  rm -f "$tmp"
}

echo "==> Sauvegarde et écriture du bloc"
sauvegarde="/root/caddyfile-ticode-$(date +%Y%m%d-%H%M%S).bak"
nouveau="$(mktemp)"
if [ -n "$caddyfile_hote" ]; then
  cp "$caddyfile_hote" "$sauvegarde"
  ecrire_bloc "$caddyfile_hote"
  echo "    hôte : $caddyfile_hote"
else
  docker exec "$cid" cat "$caddyfile_conteneur" >"$sauvegarde"
  cp "$sauvegarde" "$nouveau"
  ecrire_bloc "$nouveau"
  docker cp "$nouveau" "$cid:$caddyfile_conteneur"
  echo "    conteneur : $caddyfile_conteneur"
fi
echo "    sauvegarde : $sauvegarde"
rm -f "$nouveau"

echo "==> Validation et rechargement de Caddy"
if ! docker exec "$cid" caddy validate --config "$caddyfile_conteneur" >/tmp/caddy-validate.log 2>&1; then
  echo "    configuration refusée : on restaure la sauvegarde" >&2
  if [ -n "$caddyfile_hote" ]; then
    cp "$sauvegarde" "$caddyfile_hote"
  else
    docker cp "$sauvegarde" "$cid:$caddyfile_conteneur"
  fi
  cat /tmp/caddy-validate.log >&2
  exit 1
fi
docker exec "$cid" caddy reload --config "$caddyfile_conteneur"

echo "==> Python sur $PORT : on le GARDE"
echo "    Caddy lui envoie le trafic de $noms ; tes autres sites ne passent pas par lui."
if command -v pm2 >/dev/null 2>&1; then
  utilisateur="${SUDO_USER:-ubuntu}"
  sudo -u "$utilisateur" pm2 list 2>/dev/null | sed 's/^/    /' || true
fi

echo
echo "==> Vérification"
sleep 2
for d in "${hosts[@]}"; do
  echo -n "    http://$d  -> "
  curl -sI --max-time 8 "http://$d/" | head -1 || echo "(pas de réponse)"
  echo -n "    https://$d -> "
  curl -sI --max-time 25 "https://$d/" | head -1 || echo "(certificat en cours, attends 30 s et recharge)"
done
echo
echo "Prêt. Le site se met à jour avec :"
echo "    bash ~/juliendolou/deploy/update.sh"
if [ -z "$caddyfile_hote" ]; then
  echo
  echo "Attention : le Caddyfile n'est pas un fichier de l'hôte. Un recréage"
  echo "du conteneur Caddy ferait disparaître le bloc. Sauvegarde : $sauvegarde"
fi
if [ "${#hosts[@]}" -lt 2 ]; then
  echo
  echo "Un des deux noms ne pointe pas encore ici (souvent la racine ticode.fr"
  echo "reste sur 213.186.33.5 chez OVH). Relance ce script une fois l'A corrigé."
fi
