# Déploiement VPS (sans build)

Le site est en HTML statique. **Ne fais plus `npm run build` sur le VPS.**

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
git checkout cursor/site-studio-julien-dolou-7485
```

```bash
git pull origin cursor/site-studio-julien-dolou-7485
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
pm2 start python3 --name juliendolou --cwd /home/ubuntu/juliendolou-www -- -m http.server 8080 --bind 0.0.0.0
```

```bash
pm2 save
```

```bash
curl -I http://127.0.0.1:8080/
```

## Lightsail (important)

Ajoute une règle firewall :
- Custom TCP
- Port **8080**
- Source : Anywhere

## Accès navigateur

**http://13.36.82.63:8080**

(bien `http://` + `:8080`)
