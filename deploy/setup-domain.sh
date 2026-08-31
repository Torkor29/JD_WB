#!/usr/bin/env bash
# Prépare le VPS à servir TiCode sur un nom de domaine, en HTTPS.
#
# À lancer UNE SEULE FOIS, et seulement APRÈS avoir fait pointer le DNS du
# domaine vers l'IP de ce serveur : Let's Encrypt vérifie le domaine en venant
# frapper à la porte, et il ne peut pas le faire si le DNS n'est pas à jour.
#
#   sudo bash ~/juliendolou/deploy/setup-domain.sh ticode.fr
#
# Le script est rejouable sans dommage : il ne recrée que ce qui manque.
#
# Le VPS héberge un autre projet. Rien ici ne le touche : le bloc nginx est
# nommé, donc il ne répond que pour ce domaine, et la configuration nginx
# existante — y compris le bloc par défaut — est laissée en place.
set -euo pipefail

DOMAIN="${1:-ticode.fr}"
ROOT=/var/www/ticode
EMAIL="${CERTBOT_EMAIL:-Julien.dolou@hotmail.fr}"

[ "$(id -u)" -eq 0 ] || { echo "à lancer avec sudo" >&2; exit 1; }

echo "==> Le DNS pointe-t-il bien ici ?"
ip_serveur="$(curl -4 -s --max-time 8 https://checkip.amazonaws.com || true)"
ip_domaine="$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}' || true)"
echo "    $DOMAIN        -> ${ip_domaine:-aucune réponse}"
echo "    ce serveur     -> ${ip_serveur:-inconnue}"
if [ -z "$ip_domaine" ]; then
  echo
  echo "    Le domaine ne résout pas encore. Crée les enregistrements A chez ton" >&2
  echo "    registrar (voir deploy/README.md), attends la propagation, puis" >&2
  echo "    relance ce script." >&2
  exit 1
fi
if [ -n "$ip_serveur" ] && [ "$ip_domaine" != "$ip_serveur" ]; then
  echo
  echo "    Le domaine pointe ailleurs. Le certificat échouerait." >&2
  echo "    Corrige l'enregistrement A, attends, puis relance." >&2
  exit 1
fi

echo "==> Le port 80 est-il libre ?"
# Un serveur déjà à l'écoute sur le port 80 empêcherait nginx de démarrer et la
# vérification de Let's Encrypt d'aboutir.
occupant="$(ss -ltnp 2>/dev/null | awk '$4 ~ /:80$/ {print $NF}' | head -1 || true)"
case "$occupant" in
  ""|*nginx*) echo "    libre (ou déjà nginx)" ;;
  *) echo "    occupé par $occupant — libère le port 80 puis relance" >&2; exit 1 ;;
esac

echo "==> Installation de nginx, rsync et certbot"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx rsync certbot python3-certbot-nginx

echo "==> Racine web $ROOT"
mkdir -p "$ROOT"
if [ ! -f "$ROOT/index.html" ]; then
  # Une page d'attente, le temps du premier déploiement : sans index.html,
  # nginx répondrait 403 et la vérification du certificat pourrait échouer.
  echo '<!doctype html><meta charset="utf-8"><title>TiCode</title><p>Installation en cours.' >"$ROOT/index.html"
fi
chown -R www-data:www-data "$ROOT"

echo "==> Bloc nginx pour $DOMAIN"
cat >/etc/nginx/sites-available/ticode <<CONF
# TiCode — export statique. Généré par deploy/setup-domain.sh.
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root $ROOT;
    index index.html;

    # Export statique Next.js : chaque page existe en .html sur le disque.
    # Le HTML n'est jamais mis en cache, sinon un déploiement reste invisible
    # dans les navigateurs qui ont déjà vu la page. L'en-tête est posé ici et
    # pas seulement sur les URL en .html : les pages exportées se servent sans
    # extension, et n'auraient donc hérité d'aucune consigne.
    location / {
        try_files \$uri \$uri.html \$uri/index.html \$uri/ =404;
        add_header Cache-Control "no-cache";
    }
    error_page 404 /404.html;

    # Les fichiers dont le nom contient une empreinte peuvent être gardés
    # longtemps. Le HTML jamais : sinon un déploiement reste invisible dans les
    # navigateurs qui l'ont déjà vu.
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~* \.(webp|avif|png|jpe?g|svg|woff2?|ico)\$ {
        expires 30d;
        add_header Cache-Control "public";
    }
    location ~* \.html\$ {
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
}
CONF
ln -sfn /etc/nginx/sites-available/ticode /etc/nginx/sites-enabled/ticode
nginx -t
systemctl enable --now nginx >/dev/null
systemctl reload nginx

echo "==> Certificat HTTPS"
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "    déjà présent, renouvellement automatique en place"
else
  certbot --nginx --non-interactive --agree-tos -m "$EMAIL" --redirect \
    -d "$DOMAIN" -d "www.$DOMAIN"
fi
systemctl reload nginx

echo "==> L'ancien serveur Python n'a plus lieu d'être"
# Le site passait par pm2 et python3 -m http.server sur le port 8081. nginx le
# remplace ; laisser tourner l'ancien n'apporterait qu'une source de confusion.
if command -v pm2 >/dev/null 2>&1; then
  sudo -u "${SUDO_USER:-ubuntu}" pm2 delete juliendolou >/dev/null 2>&1 || true
  sudo -u "${SUDO_USER:-ubuntu}" pm2 save --force >/dev/null 2>&1 || true
fi

echo
echo "==> Vérification"
curl -sI "https://$DOMAIN/" | head -1 || true
echo
echo "Prêt. Déploie maintenant le site :"
echo "    bash ~/juliendolou/deploy/update.sh"
