# Déploiement — VPS Lightsail, domaine ticode.fr (DNS chez OVH)

Le site est du HTML statique déjà construit et versionné dans
`deploy/juliendolou-static.tar.gz`. **Ne lance jamais `npm run build` sur le
VPS.**

Le VPS sert déjà tes autres sites avec **Caddy** (ports 80 et 443). TiCode
s'y greffe : un bloc nommé, qui ne répond que pour `ticode.fr` /
`www.ticode.fr`. On n'installe pas nginx — deux reverse-proxys sur le même
port se marcheraient dessus.

Le DNS se gère **uniquement chez OVH**. Rien à créer dans l'onglet Domains
de Lightsail. L'IP fixe `13.36.82.63` est déjà attachée.

## Chez OVH — zone DNS de ticode.fr

Deux enregistrements A. S'il y en a déjà un sur la racine (souvent
`213.186.33.5`, la parking OVH), **modifie-le**, n'en ajoute pas un second.

| Type | Sous-domaine | Cible |
| ---- | ------------ | ----- |
| A    | *(vide)*     | `13.36.82.63` |
| A    | `www`        | `13.36.82.63` |

Pas de CNAME sur la racine.

Vérification depuis Termius :

```bash
getent ahostsv4 ticode.fr | head -1
getent ahostsv4 www.ticode.fr | head -1
```

Les deux doivent afficher `13.36.82.63`. Tant que la racine affiche encore
`213.186.33.5`, `https://ticode.fr` restera chez OVH. `www` peut déjà
fonctionner.

## Sur le VPS — une fois le DNS à jour

```bash
cd ~/juliendolou && git fetch origin cursor/julien-prisma-plage-7485 && git checkout cursor/julien-prisma-plage-7485 && git reset --hard origin/cursor/julien-prisma-plage-7485 && sudo bash deploy/setup-domain.sh ticode.fr && bash deploy/update.sh
```

Le script refuse d'avancer si Caddy n'est pas là, si le port 80 est pris par
autre chose, ou si aucun des deux noms ne pointe ici. Il sauvegarde
`/etc/caddy` avant d'écrire, et retire son bloc si Caddy refuse la config.

## Mises à jour suivantes

```bash
bash ~/juliendolou/deploy/update.sh
```

## Accès

**https://www.ticode.fr** — et **https://ticode.fr** dès que l'enregistrement
A de la racine pointe ici.

## En cas de souci

- **Le navigateur dit que le site ne répond pas, alors que le DNS est bon.**
  Caddy redirige déjà `http://www` vers HTTPS, mais sans bloc pour ce nom il
  n'a pas de certificat : d'où l'erreur TLS. Lance `setup-domain.sh`.
- **`ticode.fr` (sans www) affiche encore une page OVH.** L'enregistrement A
  de la racine pointe encore sur `213.186.33.5`. Modifie-le chez OVH.
- **Diagnostic, sans rien modifier** : `sudo bash ~/juliendolou/deploy/etat-vps.sh`
- **Le mauvais site s'affiche.** Vérifie la branche affichée par `update.sh`.
  Elle doit finir par `-7485`.
