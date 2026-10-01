#!/usr/bin/env bash
# Déploie la version web d'Empreinte sur le serveur HP (Linux, Node 20+).
#
# Deux façons :
#   1. Version déjà compilée (rapide) :  ./scripts/deployer-hp.sh
#   2. Depuis le code source (long) :    ./scripts/deployer-hp.sh source
#
# Ensuite l'app est servie sur http://<adresse-du-hp>:8080 (PORT=… pour changer).
# Avec sudo et systemd présents, un service « empreinte » est installé pour démarrer
# tout seul au redémarrage du serveur.
set -euo pipefail

MODE=${1:-archive}
ICI_TOT=$(cd "$(dirname "$0")/.." && pwd)
PORT=${PORT:-8080}
DEST=${DEST:-$HOME/empreinte-web}
ICI=$(cd "$(dirname "$0")/.." && pwd)

command -v node >/dev/null || { echo "Node.js 20 ou plus est nécessaire (https://nodejs.org)."; exit 1; }

case "$MODE" in
  archive)
    # Par défaut : la version déjà compilée, livrée dans le dépôt.
    ARCHIVE=${2:-$ICI_TOT/deploiement/empreinte-web.tar.gz}
    if [ ! -f "$ARCHIVE" ]; then
      echo "Archive introuvable : $ARCHIVE"
      echo "Copiez-la dans ce dossier, ou compilez depuis le code : $0 source"
      exit 1
    fi
    TMP=$(mktemp -d)
    tar xzf "$ARCHIVE" -C "$TMP"
    rm -rf "$DEST" && mv "$TMP"/empreinte-web-hp "$DEST" && rm -rf "$TMP"
    ;;
  source)
    # Yarn 4 via corepack (fourni avec Node), sans installation globale.
    cd "$ICI/app"
    export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
    echo "Installation des dépendances (quelques minutes la première fois)…"
    corepack yarn install
    cd apps/expo
    rm -rf "$DEST"
    echo "Compilation de la version web…"
    CI=1 EXPO_NO_TELEMETRY=1 NODE_ENV=production corepack yarn expo export --platform web --output-dir "$DEST"
    ;;
  *)
    echo "Usage : $0 archive <empreinte-web.tar.gz> | source"; exit 1 ;;
esac

SERVEUR="$ICI/scripts/servir-empreinte.mjs"
if command -v systemctl >/dev/null && sudo -n true 2>/dev/null; then
  sudo tee /etc/systemd/system/empreinte.service >/dev/null <<EOF
[Unit]
Description=Empreinte (version web)
After=network.target

[Service]
User=$(id -un)
ExecStart=$(command -v node) $SERVEUR $DEST $PORT
Restart=always

[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable --now empreinte
  sudo systemctl restart empreinte
  echo "Service « empreinte » actif : http://$(hostname -I 2>/dev/null | awk '{print $1}'):$PORT"
else
  echo "Lancement direct (Ctrl+C pour arrêter) :"
  exec node "$SERVEUR" "$DEST" "$PORT"
fi
