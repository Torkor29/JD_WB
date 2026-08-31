#!/usr/bin/env bash
# Met à jour le site sur le VPS. Le site est du HTML statique déjà construit :
# on ne compile rien ici, on déballe l'archive versionnée dans le dépôt.
#
#   bash ~/juliendolou/deploy/update.sh [branche]
#
# Sans sudo : le script n'élève ses droits que pour écrire dans /var/www et
# recharger nginx. Lancé entièrement en root, git laisserait derrière lui un
# dépôt appartenant à root.
set -euo pipefail

BRANCH="${1:-cursor/julien-prisma-plage-7485}"
# Le dépôt est déduit de l'emplacement du script : ça marche quel que soit le
# répertoire courant, et quel que soit l'utilisateur.
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT=/var/www/ticode
DOMAIN="${DOMAIN:-ticode.fr}"

echo "==> Récupération de $BRANCH"
cd "$REPO"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
# Le VPS n'est qu'une cible de déploiement : on écrase. Un pull pourrait
# s'arrêter sur un conflit et laisser l'ancien site en place sans le dire.
git reset --hard "origin/$BRANCH"
git --no-pager log --oneline -1

echo "==> Déballage de l'archive"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
tar -xzf "$REPO/deploy/juliendolou-static.tar.gz" -C "$tmp"
# Garde-fou : une archive tronquée ou mal formée remplacerait le site par du
# vide, et nginx répondrait 403 sans qu'on comprenne pourquoi.
[ -s "$tmp/index.html" ] || { echo "archive inattendue : pas d'index.html" >&2; exit 1; }

echo "==> Mise en place dans $ROOT"
sudo mkdir -p "$ROOT"
# --delete pour que les fichiers disparus d'une version à l'autre s'en aillent
# vraiment, au lieu de traîner et d'être servis.
sudo rsync -a --delete "$tmp/" "$ROOT/"
sudo chown -R www-data:www-data "$ROOT"

echo "==> Rechargement de nginx"
sudo nginx -t
sudo systemctl reload nginx

echo "==> Vérification"
code="$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN/" || true)"
echo "    https://$DOMAIN/ répond $code"
if [ "$code" != "200" ]; then
  echo "    (si le HTTPS n'est pas encore en place, lance d'abord setup-domain.sh)"
  curl -sI -H "Host: $DOMAIN" http://127.0.0.1/ | head -1 || true
fi
