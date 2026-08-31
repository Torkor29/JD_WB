#!/usr/bin/env bash
# Constat de l'état du VPS. Ne modifie RIEN : que des lectures.
#
#   bash ~/juliendolou/deploy/etat-vps.sh
#
# À passer avant d'ajouter ticode.fr, parce que le VPS héberge plusieurs sites
# et qu'il faut savoir ce qui écoute où avant d'ajouter quoi que ce soit.
set -uo pipefail

titre() { printf '\n=== %s\n' "$1"; }

titre "Identité de la machine"
echo "  IP publique      : $(curl -4 -s --max-time 8 https://checkip.amazonaws.com || echo inconnue)"
echo "  Nom              : $(hostname)"
echo "  Système          : $(. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME")"

titre "Qui écoute sur le réseau"
# La colonne « Process » n'apparaît qu'avec les droits root.
if [ "$(id -u)" -eq 0 ]; then
  ss -ltnp 2>/dev/null | awk 'NR==1 || $4 !~ /127\.0\.0\.1|\[::1\]/'
else
  echo "  (relance avec sudo pour voir quel programme tient chaque port)"
  ss -ltn 2>/dev/null | awk 'NR==1 || $4 !~ /127\.0\.0\.1|\[::1\]/'
fi

titre "Ports 80 et 443"
for port in 80 443; do
  qui="$(ss -ltnp 2>/dev/null | awk -v p=":$port\$" '$4 ~ p {print $NF; exit}')"
  echo "  $port : ${qui:-libre}"
done

titre "Caddy"
if command -v caddy >/dev/null 2>&1; then
  caddy version 2>/dev/null | sed 's/^/  /'
  echo "  Caddyfile : $([ -f /etc/caddy/Caddyfile ] && echo présent || echo absent)"
  echo "  Sites additionnels :"
  ls -1 /etc/caddy/sites-enabled/ 2>/dev/null | sed 's/^/    /' || echo "    aucun"
else
  echo "  pas installé"
fi

titre "nginx"
if command -v nginx >/dev/null 2>&1; then
  nginx -v 2>&1 | sed 's/^/  /'
  echo "  Blocs actifs :"
  ls -1 /etc/nginx/sites-enabled/ 2>/dev/null | sed 's/^/    /' || echo "    aucun"
else
  echo "  pas installé"
fi

titre "Processus pm2"
if command -v pm2 >/dev/null 2>&1; then
  pm2 list 2>/dev/null | sed 's/^/  /'
else
  echo "  pm2 absent"
fi

titre "Docker (Caddy est probablement là-dedans)"
if command -v docker >/dev/null 2>&1; then
  echo "  Conteneurs :"
  docker ps --format '    {{.Names}}\t{{.Image}}\t{{.Ports}}' 2>/dev/null || echo "    (docker ps a échoué, essaie avec sudo)"
  echo "  Conteneur(s) sur le port 80 :"
  docker ps --filter publish=80 --format '    {{.Names}}  {{.Image}}' 2>/dev/null || true
  cid="$(docker ps -q --filter publish=80 2>/dev/null | head -1 || true)"
  if [ -n "$cid" ]; then
    echo "  Montages de $(docker inspect -f '{{.Name}}' "$cid" 2>/dev/null | sed 's#^/##') :"
    docker inspect -f '{{range .Mounts}}    {{.Type}} {{.Source}} -> {{.Destination}}{{"\n"}}{{end}}' "$cid" 2>/dev/null || true
  fi
else
  echo "  docker absent"
fi

titre "Où pointent les domaines"
for d in ticode.fr www.ticode.fr; do
  echo "  $d -> $(getent ahostsv4 "$d" | awk 'NR==1{print $1}' || echo 'ne résout pas')"
done

printf '\nRien n a été modifié.\n'
