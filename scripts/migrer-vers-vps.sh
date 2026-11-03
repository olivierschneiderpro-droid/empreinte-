#!/usr/bin/env bash
# Migre les données du HP vers le VPS : comptes (PocketBase), clés, livres en cache.
# À lancer sur le HP, une fois le VPS installé (scripts/installer-vps.sh) :
#   bash scripts/migrer-vers-vps.sh root@168.231.85.13
# Le service du HP est arrêté pendant la copie (personne ne doit s'inscrire entre-temps)
# et reste arrêté ensuite : le HP garde ses données, en secours.
set -euo pipefail
CIBLE=${1:?"Usage : bash $0 root@<ip-du-vps>"}
COMPTES=${EMPREINTE_COMPTES:-$HOME/empreinte-comptes}
dire() { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }

dire "Arrêt d'Empreinte sur le HP (copie cohérente des comptes)"
sudo systemctl stop empreinte empreinte-maj.timer 2>/dev/null || true
sudo systemctl disable empreinte empreinte-maj.timer 2>/dev/null || true

dire "Préparation"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/migration"
[ -d "$COMPTES/pb_data" ] && cp -a "$COMPTES/pb_data" "$TMP/migration/"
[ -f "$HOME/.empreinte-cles" ] && cp "$HOME/.empreinte-cles" "$TMP/migration/"
[ -d "$HOME/empreinte-livres" ] && cp -a "$HOME/empreinte-livres" "$TMP/migration/"
tar czf "$TMP/migration.tar.gz" -C "$TMP/migration" .
ls -lh "$TMP/migration.tar.gz"

dire "Envoi vers $CIBLE"
scp "$TMP/migration.tar.gz" "$CIBLE:/tmp/empreinte-migration.tar.gz"
ssh "$CIBLE" 'bash -s' <<'DISTANT'
set -euo pipefail
MAISON=$(getent passwd empreinte | cut -d: -f6)
[ -n "$MAISON" ] || { echo "Lancez d'abord scripts/installer-vps.sh sur le VPS."; exit 1; }
systemctl stop empreinte
TMP=$(mktemp -d)
tar xzf /tmp/empreinte-migration.tar.gz -C "$TMP"
mkdir -p "$MAISON/empreinte-comptes"
if [ -d "$TMP/pb_data" ]; then
  [ -d "$MAISON/empreinte-comptes/pb_data" ] &&
    mv "$MAISON/empreinte-comptes/pb_data" "$MAISON/empreinte-comptes/pb_data.avant-migration-$(date +%s)"
  mv "$TMP/pb_data" "$MAISON/empreinte-comptes/pb_data"
fi
[ -f "$TMP/.empreinte-cles" ] && install -m 600 "$TMP/.empreinte-cles" "$MAISON/.empreinte-cles"
[ -d "$TMP/empreinte-livres" ] && rm -rf "$MAISON/empreinte-livres" && mv "$TMP/empreinte-livres" "$MAISON/"
chown -R empreinte:empreinte "$MAISON/empreinte-comptes" "$MAISON/.empreinte-cles" "$MAISON/empreinte-livres" 2>/dev/null || true
rm -rf "$TMP" /tmp/empreinte-migration.tar.gz
systemctl start empreinte
echo "✔ Données du HP installées sur le VPS, Empreinte relancé."
DISTANT

cat <<FIN

Migration terminée. Le HP est arrêté mais garde toutes ses données dans $COMPTES.
Pour le rallumer en secours : sudo systemctl enable --now empreinte empreinte-maj.timer
FIN
