# Déploiement — VPS Lightsail, domaine ticode.fr (DNS chez OVH)

Le site est du HTML statique déjà construit et versionné dans
`deploy/juliendolou-static.tar.gz`. **Ne lance jamais `npm run build` sur le
VPS.**

Tes autres sites passent par **Caddy dans Docker** (ports 80 et 443 via
`docker-proxy`). TiCode s'y greffe : un bloc nommé qui reverse-proxifie vers
le python déjà en écoute sur 8081. On n'installe ni nginx ni un second
Caddy. Les autres blocs ne sont pas touchés, et python sur 8081 est **gardé**.

Le DNS se gère **uniquement chez OVH**. L'IP fixe `13.36.82.63` est déjà
attachée côté Lightsail.

## Chez OVH — zone DNS de ticode.fr

Deux enregistrements A. S'il y en a déjà un sur la racine (souvent
`213.186.33.5`), **modifie-le**.

| Type | Sous-domaine | Cible |
| ---- | ------------ | ----- |
| A    | *(vide)*     | `13.36.82.63` |
| A    | `www`        | `13.36.82.63` |

```bash
getent ahostsv4 ticode.fr | head -1
getent ahostsv4 www.ticode.fr | head -1
```

Les deux doivent afficher `13.36.82.63`.

## Sur le VPS

```bash
cd ~/juliendolou && git fetch origin cursor/julien-prisma-plage-7485 && git checkout cursor/julien-prisma-plage-7485 && git reset --hard origin/cursor/julien-prisma-plage-7485 && sudo bash deploy/setup-domain.sh ticode.fr && bash deploy/update.sh
```

Le script trouve le conteneur Caddy, édite son Caddyfile (sauvegarde avant),
valide, recharge. Si Caddy refuse la config, la sauvegarde est restaurée.

## Mises à jour suivantes

```bash
bash ~/juliendolou/deploy/update.sh
```

## En cas de souci

- **Diagnostic** : `sudo bash ~/juliendolou/deploy/etat-vps.sh`
- **`ticode.fr` sans www reste chez OVH** : l'A de la racine vaut encore
  `213.186.33.5`.
