#!/usr/bin/env bash
# Met à jour le site sur le VPS. Le site est du HTML statique déjà construit :
# on ne compile rien ici, on déballe l'archive versionnée dans le dépôt.
#
#   bash ~/juliendolou/deploy/update.sh [branche]
set -euo pipefail

BRANCH="${1:-cursor/julien-prisma-plage-7485}"
REPO="$HOME/juliendolou"
WWW="$HOME/juliendolou-www"
PORT=8081  # 8080 est pris par Comptap

export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "==> Récupération de $BRANCH"
cd "$REPO"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
# Le VPS n'est qu'une cible de déploiement : on écrase, un pull pourrait
# s'arrêter sur un conflit et laisser l'ancien site en place sans le dire.
git reset --hard "origin/$BRANCH"
git --no-pager log --oneline -1

echo "==> Arrêt du serveur"
pm2 delete juliendolou >/dev/null 2>&1 || true
# pm2 ne libère pas toujours le port : un serveur orphelin le garde et le
# redémarrage échoue en « Address already in use ».
fuser -k "$PORT/tcp" >/dev/null 2>&1 || sudo -n fuser -k "$PORT/tcp" >/dev/null 2>&1 || true

echo "==> Déballage de l'archive"
rm -rf "$WWW"
mkdir -p "$WWW"
tar -xzf "$REPO/deploy/juliendolou-static.tar.gz" -C "$WWW"

echo "==> Démarrage sur le port $PORT"
pm2 start python3 --name juliendolou --cwd "$WWW" -- -m http.server "$PORT" --bind 0.0.0.0
pm2 save --force >/dev/null

sleep 1
echo "==> Vérification"
curl -sI "http://127.0.0.1:$PORT/" | head -1
echo "En ligne sur http://13.36.82.63:$PORT"
