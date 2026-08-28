# Déploiement VPS (sans build)

Le site est en HTML statique. **Ne fais plus `npm run build` sur le VPS.**

> **Important :** le port **8080** est déjà pris (Comptap). TiCode tourne sur **8081**.

## Sur Termius — une commande à la fois

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
```

```bash
pm2 delete juliendolou || true
```

```bash
cd ~/juliendolou
```

```bash
git fetch origin
```

```bash
git checkout cursor/julien-prisma-plage-7485
```

```bash
git pull origin cursor/julien-prisma-plage-7485
```

```bash
rm -rf ~/juliendolou-www
```

```bash
mkdir -p ~/juliendolou-www
```

```bash
tar -xzf deploy/juliendolou-static.tar.gz -C ~/juliendolou-www
```

```bash
pm2 start python3 --name juliendolou --cwd /home/ubuntu/juliendolou-www -- -m http.server 8081 --bind 0.0.0.0
```

```bash
pm2 save
```

```bash
curl -I http://127.0.0.1:8081/
```

## Lightsail

Règle firewall :
- Custom TCP
- Port **8081**
- Source : Anywhere IPv4 (`0.0.0.0/0`)

## Accès navigateur

**http://13.36.82.63:8081**
