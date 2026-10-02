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

# 2. Version web. Deux sources, la plus récemment changée l'emporte :
#    - la version « web-latest » compilée par GitHub Actions ;
#    - l'archive livrée dans le dépôt (deploiement/empreinte-web.tar.gz), mise à jour par git pull.
MEMOIRE=${MEMOIRE:-$HOME/.empreinte-maj}
mkdir -p "$MEMOIRE"

installer() { # installer <archive.tar.gz> <libellé>
  local tmp
  tmp=$(mktemp -d)
  tar xzf "$1" -C "$tmp"
  if [ ! -f "$tmp/empreinte-web-hp/index.html" ]; then
    dire "Archive incomplète ($2), rien n'est changé."; rm -rf "$tmp"; return 1
  fi
  # Bascule : l'ancienne version reste jusqu'au dernier moment.
  rm -rf "$DEST.ancienne"
  [ -d "$DEST" ] && mv "$DEST" "$DEST.ancienne"
  mv "$tmp/empreinte-web-hp" "$DEST"
  rm -rf "$DEST.ancienne" "$tmp"
  dire "Version web en ligne ($2)."
}

ARCHIVE_DEPOT="$ICI/deploiement/empreinte-web.tar.gz"
if [ -f "$ARCHIVE_DEPOT" ]; then
  EMPREINTE=$(git -C "$ICI" hash-object "$ARCHIVE_DEPOT" 2>/dev/null || sha1sum "$ARCHIVE_DEPOT" | cut -c1-40)
  if [ "$EMPREINTE" != "$(cat "$MEMOIRE/depot" 2>/dev/null)" ]; then
    installer "$ARCHIVE_DEPOT" "archive du dépôt ${EMPREINTE:0:7}" && echo "$EMPREINTE" > "$MEMOIRE/depot"
  fi
fi

DISTANTE=$(curl -fsSL "$BASE/version.txt" 2>/dev/null | tr -d '[:space:]') || true
if [ -n "${DISTANTE:-}" ] && [ "$DISTANTE" != "$(cat "$MEMOIRE/github" 2>/dev/null)" ]; then
  TMP=$(mktemp -d)
  if curl -fsSL "$BASE/empreinte-web.tar.gz" -o "$TMP/web.tar.gz"; then
    installer "$TMP/web.tar.gz" "GitHub ${DISTANTE:0:7}" && echo "$DISTANTE" > "$MEMOIRE/github"
  fi
  rm -rf "$TMP"
fi
