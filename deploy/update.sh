#!/usr/bin/env bash
# Met à jour le site sur le VPS. HTML statique déjà construit : on ne compile
# rien ici, on déballe l'archive versionnée.
#
#   bash ~/juliendolou/deploy/update.sh [branche]
#
# Caddy (dans Docker) reverse-proxifie vers python sur 8081. On met donc à
# jour le dossier servi par python, sans toucher à Caddy ni aux autres sites.
set -euo pipefail

BRANCH="${1:-cursor/julien-prisma-plage-7485}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WWW="${WWW:-$HOME/juliendolou-www}"
PORT=8081
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

echo "==> Mise en place dans $WWW"
mkdir -p "$WWW"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$tmp/" "$WWW/"
else
  find "$WWW" -mindepth 1 -delete
  cp -a "$tmp"/. "$WWW"/
fi

echo "==> Serveur python sur $PORT"
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe juliendolou >/dev/null 2>&1; then
    pm2 restart juliendolou >/dev/null
  else
    fuser -k "$PORT/tcp" >/dev/null 2>&1 || true
    pm2 start python3 --name juliendolou --cwd "$WWW" -- -m http.server "$PORT" --bind 0.0.0.0
    pm2 save --force >/dev/null
  fi
else
  echo "    pm2 absent : le python déjà en écoute sur $PORT servira les nouveaux fichiers"
fi

sleep 1
echo "==> Vérification"
echo -n "    http://127.0.0.1:$PORT/ -> "
curl -sI --max-time 5 "http://127.0.0.1:$PORT/" | head -1 || echo "(python ne répond pas)"
for d in "www.$DOMAIN" "$DOMAIN"; do
  echo -n "    https://$d/ -> "
  curl -sI --max-time 8 "https://$d/" | head -1 || echo "(Caddy pas encore configuré pour ce nom)"
done
