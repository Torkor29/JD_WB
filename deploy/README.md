# Déploiement VPS (sans build)

Le site est exporté en HTML statique. **Ne lance plus `npm run build` sur le VPS.**

## Sur Termius (une commande à la fois)

```bash
cd ~
```

```bash
pm2 delete juliendolou || true
```

```bash
curl -L -o juliendolou-static.tar.gz https://raw.githubusercontent.com/Torkor29/JD_WB/cursor/site-studio-julien-dolou-7485/deploy/juliendolou-static.tar.gz
```

```bash
rm -rf ~/juliendolou-www
```

```bash
mkdir -p ~/juliendolou-www
```

```bash
tar -xzf juliendolou-static.tar.gz -C ~/juliendolou-www
```

```bash
pm2 start python3 --name juliendolou -- -m http.server 8080 --bind 0.0.0.0 --directory /home/ubuntu/juliendolou-www
```

```bash
pm2 save
```

```bash
curl -I http://127.0.0.1:8080
```

## Lightsail

Ajoute une règle firewall :
- Custom TCP
- Port **8080**
- Anywhere

## Accès

http://13.36.82.63:8080
