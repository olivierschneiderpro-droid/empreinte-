#!/usr/bin/env sh
# Télécharge les sources open source dont Empreinte dépend.
set -e
cd "$(dirname "$0")/.."
# Bible Strong (GPL-3.0) : application complète, épinglée sur un commit précis, sans historique.
git submodule update --init --depth 1 vendor/bible-strong
npm install
echo "✔ Sources prêtes. Essayer : npm run demo"
