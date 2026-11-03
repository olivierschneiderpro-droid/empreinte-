#!/usr/bin/env bash
# Sauvegarde des comptes Empreinte (PocketBase) : une copie cohérente de la base, même
# pendant que le serveur tourne (sqlite3 .backup), plus les fichiers envoyés et les clés.
# Lancé chaque nuit par le minuteur « empreinte-sauvegarde » ; garde les 14 dernières.
set -euo pipefail
COMPTES=${EMPREINTE_COMPTES:-$HOME/empreinte-comptes}
DOSSIER=${SAUVEGARDES:-$HOME/sauvegardes}
GARDER=${GARDER:-14}
[ -f "$COMPTES/pb_data/data.db" ] || { echo "Pas encore de comptes à sauvegarder."; exit 0; }
umask 077
mkdir -p "$DOSSIER"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/pb_data"
if command -v sqlite3 >/dev/null; then
  sqlite3 "$COMPTES/pb_data/data.db" ".backup '$TMP/pb_data/data.db'"
else
  python3 -c 'import sqlite3, sys; sqlite3.connect(sys.argv[1]).backup(sqlite3.connect(sys.argv[2]))' \
    "$COMPTES/pb_data/data.db" "$TMP/pb_data/data.db"
fi
[ -d "$COMPTES/pb_data/storage" ] && cp -a "$COMPTES/pb_data/storage" "$TMP/pb_data/"
[ -f "$HOME/.empreinte-cles" ] && cp "$HOME/.empreinte-cles" "$TMP/"
NOM="comptes-$(date +%F-%H%M).tar.gz"
tar czf "$DOSSIER/$NOM" -C "$TMP" .
ls -1t "$DOSSIER"/comptes-*.tar.gz | tail -n +$((GARDER + 1)) | xargs -r rm -f
echo "Sauvegarde : $DOSSIER/$NOM"
