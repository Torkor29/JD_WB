# Déploiement — VPS Lightsail, domaine ticode.fr

Le site est du HTML statique déjà construit et versionné dans
`deploy/juliendolou-static.tar.gz`. **Ne lance jamais `npm run build` sur le
VPS.**

nginx sert le site sur les ports 80 et 443. Il remplace l'ancien
`python3 -m http.server` sur le port 8081, qui ne pouvait pas faire de HTTPS et
imposait un numéro de port dans l'adresse. L'autre projet du VPS n'est pas
touché : le bloc nginx est nommé, il ne répond que pour `ticode.fr`.

## Mise en route du domaine — à faire une seule fois

### 1. IP fixe côté Lightsail

**À faire avant tout le reste.** Par défaut, l'IP publique d'une instance
Lightsail change à chaque arrêt/redémarrage. Le domaine pointerait alors dans le
vide.

Console Lightsail → **Networking** → **Create static IP** → attache-la à
l'instance. Note l'IP obtenue, c'est elle qui va dans le DNS.

### 2. Ouvrir les ports 80 et 443

Console Lightsail → l'instance → onglet **Networking** → **IPv4 Firewall** →
**Add rule**, deux fois :

| Application | Protocole | Port | Source            |
| ----------- | --------- | ---- | ----------------- |
| HTTP        | TCP       | 80   | Anywhere `0.0.0.0/0` |
| HTTPS       | TCP       | 443  | Anywhere `0.0.0.0/0` |

Le port 80 n'est pas optionnel : Let's Encrypt s'en sert pour vérifier que le
domaine est bien à toi.

Si l'instance est une EC2 et non une Lightsail, c'est le même principe dans le
groupe de sécurité : deux règles entrantes, TCP 80 et TCP 443, source
`0.0.0.0/0`. Et l'IP fixe s'appelle une *Elastic IP*.

### 3. Faire pointer ticode.fr vers l'IP fixe

Chez le registrar où tu as acheté le domaine, dans la zone DNS, deux
enregistrements :

| Type | Nom             | Valeur              | TTL  |
| ---- | --------------- | ------------------- | ---- |
| A    | `@` (ou vide)   | *ton IP fixe*       | 300  |
| A    | `www`           | *ton IP fixe*       | 300  |

Pas d'enregistrement CNAME sur `@` : c'est interdit à la racine d'un domaine.

Si tu préfères gérer le DNS dans AWS : Route 53 → **Create hosted zone** pour
`ticode.fr`, crée les deux enregistrements A ci-dessus, puis recopie les quatre
serveurs de noms `ns-….awsdns-….` de la zone dans les « serveurs DNS » du
domaine chez le registrar. Compte quelques heures de propagation.

Pour vérifier depuis Termius, avant d'aller plus loin :

```bash
getent ahostsv4 ticode.fr | head -1 && curl -4 -s https://checkip.amazonaws.com
```

Les deux lignes doivent afficher la même IP. Tant que ce n'est pas le cas,
n'enchaîne pas : le certificat échouerait.

### 4. Installer nginx et le certificat

Une fois le DNS à jour :

```bash
cd ~/juliendolou && git fetch origin cursor/julien-prisma-plage-7485 && git checkout cursor/julien-prisma-plage-7485 && git reset --hard origin/cursor/julien-prisma-plage-7485 && sudo bash deploy/setup-domain.sh ticode.fr
```

Le script vérifie le DNS et le port 80, installe nginx et certbot, écrit le bloc
nginx, obtient le certificat, met en place la redirection HTTP → HTTPS et arrête
l'ancien serveur Python. Il est rejouable sans dommage.

### 5. Déployer le site

```bash
bash ~/juliendolou/deploy/update.sh
```

## Mettre à jour ensuite — un seul copier-coller

```bash
bash ~/juliendolou/deploy/update.sh
```

Le script récupère la branche, déballe l'archive dans `/var/www/ticode`,
recharge nginx et vérifie que `https://ticode.fr/` répond 200.

Pour déployer une autre branche, passe-la en argument :

```bash
bash ~/juliendolou/deploy/update.sh ma-branche
```

## Accès

**https://ticode.fr** — et `www.ticode.fr` y redirige.

Le HTML n'est jamais mis en cache par nginx, donc un déploiement est visible
tout de suite. Si tu as un doute, recharge en forçant (Ctrl+Shift+R).

## En cas de souci

`bash ~/juliendolou/deploy/update.sh` est rejouable autant de fois que
nécessaire. Pièges déjà rencontrés :

- **Le certificat est refusé.** Presque toujours le DNS : `getent ahostsv4
  ticode.fr` doit renvoyer l'IP du serveur. Sinon, attends la propagation.
  Sinon encore, vérifie que le port 80 est ouvert dans le pare-feu Lightsail.
- **Le site répond 403.** La racine `/var/www/ticode` est vide ou illisible.
  Relance `update.sh`, qui refuse de déployer une archive sans `index.html`.
- **Le mauvais site s'affiche.** Vérifie la branche affichée par le script.
  Elle doit finir par `-7485`.
- **Le site a disparu après un redémarrage de l'instance.** L'IP publique a
  changé faute d'IP fixe. Reprends l'étape 1.
- **Diagnostic nginx** : `sudo nginx -t`, puis
  `sudo tail -30 /var/log/nginx/error.log`.
- **Renouvellement du certificat** : automatique (minuterie systemd de certbot).
  Pour s'en assurer : `sudo certbot renew --dry-run`.
