#!/usr/bin/env bash
# Met à jour le site sur le VPS. Le site est du HTML statique déjà construit :
# on ne compile rien ici, on déballe l'archive versionnée dans le dépôt.
#
#   bash ~/juliendolou/deploy/update.sh [branche]
#
# Sans sudo : le script n'élève ses droits que pour écrire dans /var/www.
# Lancé entièrement en root, git laisserait derrière lui un dépôt appartenant
# à root.
set -euo pipefail

BRANCH="${1:-cursor/julien-prisma-plage-7485}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT=/var/www/ticode
DOMAIN="${DOMAIN:-ticode.fr}"

echo "==> Récupération de $BRANCH"
cd "$REPO"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git --no-pager log --oneline -1

echo "==> Déballage de l'archive"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
tar -xzf "$REPO/deploy/juliendolou-static.tar.gz" -C "$tmp"
[ -s "$tmp/index.html" ] || { echo "archive inattendue : pas d'index.html" >&2; exit 1; }

echo "==> Mise en place dans $ROOT"
sudo mkdir -p "$ROOT"
sudo rsync -a --delete "$tmp/" "$ROOT/"
sudo chown -R www-data:www-data "$ROOT"
sudo chmod -R a+rX "$ROOT"

echo "==> Vérification"
for d in "www.$DOMAIN" "$DOMAIN"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 "https://$d/" || true)"
  echo "    https://$d/ répond ${code:-rien}"
done
if ! curl -sf --max-time 8 "https://www.$DOMAIN/" >/dev/null && ! curl -sf --max-time 8 "https://$DOMAIN/" >/dev/null; then
  echo "    (si le HTTPS n'est pas encore en place, lance d'abord setup-domain.sh)"
  curl -sI -H "Host: www.$DOMAIN" http://127.0.0.1/ | head -1 || true
fi
