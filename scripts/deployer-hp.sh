#!/usr/bin/env bash
# Installe Empreinte (version web) sur le serveur HP (Linux, Node 20+), avec les mises à jour
# automatiques : à lancer une seule fois, ensuite tout se met à jour tout seul.
#
#   ./scripts/deployer-hp.sh           dernière version (dépôt ou GitHub) + mises à jour auto
#   ./scripts/deployer-hp.sh archive   version livrée dans le dépôt (deploiement/)
#   ./scripts/deployer-hp.sh source    compilation sur le serveur (long)
#
# L'app est servie sur http://<adresse-du-hp>:8080 (PORT=… pour changer).
# Avec sudo et systemd, deux services sont installés :
#   - « empreinte »          : le serveur web, relancé seul au redémarrage du HP ;
#   - « empreinte-maj.timer » : toutes les 30 secondes, récupère la dernière version
#                               (dépôt ou GitHub, scripts/mise-a-jour-hp.sh).
set -euo pipefail

MODE=${1:-github}
ICI=$(cd "$(dirname "$0")/.." && pwd)
PORT=${PORT:-8080}
DEST=${DEST:-$HOME/empreinte-web}
export DEST

command -v node >/dev/null || { echo "Node.js 20 ou plus est nécessaire (https://nodejs.org)."; exit 1; }

installer_archive() {
  local archive=$1 tmp
  tmp=$(mktemp -d)
  tar xzf "$archive" -C "$tmp"
  rm -rf "$DEST" && mv "$tmp"/empreinte-web-hp "$DEST" && rm -rf "$tmp"
}

case "$MODE" in
  github)
    # Repart de zéro : installe l'archive du dépôt, puis la version GitHub si elle existe.
    rm -rf "$HOME/.empreinte-maj"
    bash "$ICI/scripts/mise-a-jour-hp.sh"
    [ -f "$DEST/index.html" ] || installer_archive "$ICI/deploiement/empreinte-web.tar.gz"
    ;;
  archive)
    ARCHIVE=${2:-$ICI/deploiement/empreinte-web.tar.gz}
    [ -f "$ARCHIVE" ] || { echo "Archive introuvable : $ARCHIVE"; exit 1; }
    installer_archive "$ARCHIVE"
    ;;
  source)
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
    echo "Usage : $0 [github | archive <empreinte-web.tar.gz> | source]"; exit 1 ;;
esac

SERVEUR="$ICI/scripts/servir-empreinte.mjs"
MAJ="$ICI/scripts/mise-a-jour-hp.sh"
UTILISATEUR=$(id -un)
if command -v systemctl >/dev/null && sudo -n true 2>/dev/null; then
  sudo tee /etc/systemd/system/empreinte.service >/dev/null <<EOF
[Unit]
Description=Empreinte (version web)
After=network.target

[Service]
User=$UTILISATEUR
# Clés des services (YOUVERSION_KEY=…), gardées hors du dépôt public.
EnvironmentFile=-$HOME/.empreinte-cles
ExecStart=$(command -v node) $SERVEUR $DEST $PORT
Restart=always
RestartSec=1

[Install]
WantedBy=multi-user.target
EOF
  sudo tee /etc/systemd/system/empreinte-maj.service >/dev/null <<EOF
[Unit]
Description=Empreinte : récupérer la dernière version
After=network-online.target

[Service]
Type=oneshot
User=$UTILISATEUR
Environment=DEST=$DEST HOME=$HOME
ExecStart=/usr/bin/env bash $MAJ
EOF
  sudo tee /etc/systemd/system/empreinte-maj.timer >/dev/null <<EOF
[Unit]
Description=Empreinte : vérifier les mises à jour toutes les 30 secondes

[Timer]
OnBootSec=30s
OnUnitActiveSec=30s
AccuracySec=1s

[Install]
WantedBy=timers.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable --now empreinte empreinte-maj.timer
  sudo systemctl restart empreinte
  echo "Service « empreinte » actif : http://$(hostname -I 2>/dev/null | awk '{print $1}'):$PORT"
  echo "Mises à jour automatiques actives (toutes les 30 s). Suivi : journalctl -u empreinte-maj -f"
else
  echo "sudo indisponible : lancez d'abord « sudo -v », puis relancez ce script pour les"
  echo "mises à jour automatiques. Lancement direct en attendant (Ctrl+C pour arrêter) :"
  exec node "$SERVEUR" "$DEST" "$PORT"
fi
