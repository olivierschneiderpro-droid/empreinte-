#!/usr/bin/env bash
# Mise à jour automatique d'Empreinte sur le serveur HP (lancé toutes les 30 secondes par
# le minuteur systemd « empreinte-maj », installé par deployer-hp.sh).
#
# 1. Met à jour les scripts du dépôt (git pull sur main).
# 2. Si une nouvelle version web est publiée sur GitHub (version « web-latest »),
#    la télécharge et la met en place d'un coup. Le serveur la sert aussitôt, sans
#    redémarrer ; s'il a lui-même changé, il redémarre seul.
set -euo pipefail

ICI=$(cd "$(dirname "$0")/.." && pwd)
DEST=${DEST:-$HOME/empreinte-web}
DEPOT=${DEPOT:-olivierschneiderpro-droid/empreinte-}
BASE=${BASE:-"https://github.com/$DEPOT/releases/download/web-latest"}
dire() { echo "[$(date '+%F %T')] $*"; }

# 1. Scripts du dépôt (sans jamais écraser une modification locale).
if git -C "$ICI" rev-parse --git-dir >/dev/null 2>&1; then
  git -C "$ICI" fetch -q origin main || dire "git fetch impossible (réseau ?)"
  if [ "$(git -C "$ICI" rev-parse --abbrev-ref HEAD)" != "main" ]; then
    git -C "$ICI" checkout -q main 2>/dev/null || dire "Passage sur main impossible : modifications locales ?"
  fi
  git -C "$ICI" merge -q --ff-only origin/main 2>/dev/null || dire "Dépôt local modifié : mise à jour des scripts ignorée."
fi

# 2. Version web.
DISTANTE=$(curl -fsSL "$BASE/version.txt" 2>/dev/null | tr -d '[:space:]') || true
if [ -z "${DISTANTE:-}" ]; then
  dire "Aucune version publiée pour l'instant (ou réseau indisponible)."
  exit 0
fi
LOCALE=$(cat "$DEST/.version" 2>/dev/null || true)
if [ "$DISTANTE" = "$LOCALE" ]; then
  exit 0
fi

dire "Nouvelle version web : ${DISTANTE:0:7} (installée : ${LOCALE:0:7})"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
curl -fsSL "$BASE/empreinte-web.tar.gz" -o "$TMP/web.tar.gz"
tar xzf "$TMP/web.tar.gz" -C "$TMP"
[ -f "$TMP/empreinte-web-hp/index.html" ] || { dire "Archive incomplète, rien n'est changé."; exit 1; }
echo "$DISTANTE" > "$TMP/empreinte-web-hp/.version"

# Bascule : l'ancienne version reste jusqu'au dernier moment.
rm -rf "$DEST.ancienne"
[ -d "$DEST" ] && mv "$DEST" "$DEST.ancienne"
mv "$TMP/empreinte-web-hp" "$DEST"
rm -rf "$DEST.ancienne"
dire "Version ${DISTANTE:0:7} en ligne."
