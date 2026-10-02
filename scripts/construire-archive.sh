#!/usr/bin/env bash
# Construit l'archive web livrée au serveur HP (deploiement/empreinte-web.tar.gz).
# À lancer avant chaque PR qui touche l'app : le HP n'installe une nouvelle version
# que lorsque cette archive change.
set -euo pipefail
ICI=$(cd "$(dirname "$0")/.." && pwd)
SORTIE=$(mktemp -d)
VERSION=$(TZ=Europe/Paris date '+%-d/%m %Hh%M')
cd "$ICI/app/apps/expo"
CI=1 EXPO_NO_TELEMETRY=1 NODE_ENV=production \
  EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1 EXPO_UNSTABLE_TREE_SHAKING=1 \
  EXPO_PUBLIC_EMPREINTE_VERSION="$VERSION" \
  npx expo export --platform web --output-dir "$SORTIE/empreinte-web-hp"
echo "$VERSION" > "$SORTIE/empreinte-web-hp/version.txt"
tar czf "$ICI/deploiement/empreinte-web.tar.gz" -C "$SORTIE" empreinte-web-hp
rm -rf "$SORTIE"
echo "Archive prête : version du $VERSION"
