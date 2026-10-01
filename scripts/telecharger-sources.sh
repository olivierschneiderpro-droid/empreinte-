#!/usr/bin/env sh
# Installe les dépendances d'Empreinte et de l'application (fork de Bible Strong dans app/).
set -e
cd "$(dirname "$0")/.."
npm install
cd app
# Yarn 4 depuis le registre npm (repo.yarnpkg.com peut être bloqué)
npx --yes @yarnpkg/cli-dist@4.12.0 install || yarn install
echo "✔ Prêt. Application web : cd app && yarn dev:expo:web"
