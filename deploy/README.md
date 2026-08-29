# Déploiement VPS

Le site est du HTML statique déjà construit et versionné dans
`deploy/juliendolou-static.tar.gz`. **Ne lance jamais `npm run build` sur le
VPS.**

> Le port **8080** est pris par Comptap. TiCode tourne sur **8081**.

## Mettre à jour — un seul copier-coller

```bash
bash ~/juliendolou/deploy/update.sh
```

Le script récupère la branche, arrête le serveur, déballe l'archive, redémarre
et vérifie que ça répond.

Si le script n'existe pas encore sur le VPS (première fois), va le chercher
d'abord :

```bash
cd ~/juliendolou && git fetch origin cursor/julien-prisma-plage-7485 && git checkout cursor/julien-prisma-plage-7485 && git reset --hard origin/cursor/julien-prisma-plage-7485 && bash deploy/update.sh
```

Pour déployer une autre branche, passe-la en argument :

```bash
bash ~/juliendolou/deploy/update.sh ma-branche
```

## Lightsail

Règle firewall à avoir une fois pour toutes :

- Custom TCP
- Port **8081**
- Source : Anywhere IPv4 (`0.0.0.0/0`)

## Accès

**http://13.36.82.63:8081** — recharge en forçant (Ctrl+Shift+R) après un
déploiement, le HTML peut rester en cache.

## En cas de souci

`bash ~/juliendolou/deploy/update.sh` est rejouable autant de fois que
nécessaire. Deux pièges déjà rencontrés :

- **`Address already in use`** : un serveur orphelin garde le port. Le script
  le tue déjà, mais si ça persiste, `sudo fuser -k 8081/tcp` puis relance.
- **Le mauvais site s'affiche** : vérifie la branche affichée par le script.
  Elle doit finir par `-7485`, pas `-748`.
