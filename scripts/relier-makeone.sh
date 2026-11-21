#!/usr/bin/env bash
# Relie ce serveur (celui des sites et des applications) à MakeOne.
#
#   sudo bash relier-makeone.sh
#
# Installe un exécuteur MakeOne (act_runner, étiquette « sites ») qui tourne sous
# l'utilisateur « deployeur ». C'est lui qui va chercher les tâches sur MakeOne, par une
# connexion sortante en HTTPS : aucun port à ouvrir, aucune clé SSH chez MakeOne. Un
# workflow qui demande « runs-on: sites » s'exécute alors ici.
#
# Le jeton d'inscription se crée dans MakeOne : votre organisation → Paramètres → Actions →
# Exécuteurs → « Créer un exécuteur ». Pris au niveau de l'organisation, seuls ses dépôts
# peuvent utiliser ce serveur. Le script le demande, il n'est écrit nulle part.
#
# Le deployeur n'a aucun droit d'administrateur, sauf ceux que vous lui donnez :
#   --autoriser empreinte-maj   peut lancer / redémarrer ce service systemd (répétable)
#   --docker                    peut piloter Docker (attention : équivaut à root sur ce serveur)
#
# Brancher Empreinte sur MakeOne (le serveur prend alors le code sur MakeOne, plus sur GitHub) :
#   --empreinte https://makeone.space/PROPRIETAIRE/empreinte-.git
#   (demande un jeton MakeOne en lecture seule, gardé dans ~empreinte/.git-credentials)
#
# Options : --makeone https://makeone.space  --nom srv-sites  --etiquette sites  --version 0.6.1
set -euo pipefail

MAKEONE=https://makeone.space
NOM=$(hostname -s)-sites
ETIQUETTE=sites
VERSION=0.6.1
SERVICES=()
DOCKER=non
EMPREINTE=
while [ $# -gt 0 ]; do
  case "$1" in
    --makeone) MAKEONE=${2%/}; shift 2 ;;
    --nom) NOM=$2; shift 2 ;;
    --etiquette) ETIQUETTE=$2; shift 2 ;;
    --version) VERSION=$2; shift 2 ;;
    --autoriser) SERVICES+=("${2%.service}"); shift 2 ;;
    --docker) DOCKER=oui; shift ;;
    --empreinte) EMPREINTE=$2; shift 2 ;;
    *) echo "Option inconnue : $1"; exit 1 ;;
  esac
done

dire() { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }
[ "$(id -u)" = 0 ] || { echo "Lancez ce script avec sudo."; exit 1; }

UTILISATEUR=deployeur
MAISON=/var/lib/makeone-executeur
BINAIRE=/usr/local/bin/act_runner

# --- 1. L'utilisateur deployeur ---------------------------------------------------------
dire "Utilisateur $UTILISATEUR"
if ! id "$UTILISATEUR" >/dev/null 2>&1; then
  useradd --system --create-home --home-dir "$MAISON" --shell /bin/bash "$UTILISATEUR"
fi
mkdir -p "$MAISON" && chown "$UTILISATEUR": "$MAISON" && chmod 750 "$MAISON"
command -v git >/dev/null || apt-get install -y -qq git >/dev/null
command -v node >/dev/null || echo "⚠ Node.js absent : les actions JavaScript (actions/checkout…) ne marcheront pas."

# --- 2. Le programme act_runner ----------------------------------------------------------
dire "Exécuteur act_runner $VERSION"
if [ ! -x "$BINAIRE" ] || ! "$BINAIRE" --version 2>/dev/null | grep -q "$VERSION"; then
  case "$(uname -m)" in
    x86_64) ARCH=amd64 ;;
    aarch64 | arm64) ARCH=arm64 ;;
    *) echo "Architecture non prise en charge : $(uname -m)"; exit 1 ;;
  esac
  TMP=$(mktemp -d)
  if curl -fsSL "https://dl.gitea.com/act_runner/$VERSION/act_runner-$VERSION-linux-$ARCH" -o "$TMP/act_runner" ||
    curl -fsSL "https://gitea.com/gitea/act_runner/releases/download/v$VERSION/act_runner-$VERSION-linux-$ARCH" -o "$TMP/act_runner"; then
    :
  elif command -v docker >/dev/null; then
    # Même programme que l'exécuteur de la machine HP, sorti de son image officielle.
    ID=$(docker create "gitea/act_runner:$VERSION")
    docker cp "$ID:/usr/local/bin/act_runner" "$TMP/act_runner"
    docker rm "$ID" >/dev/null
  else
    echo "✘ Téléchargement d'act_runner impossible. Copiez-le depuis la machine HP :"
    echo "    docker cp \$(docker ps -qf name=makehub_executeur):/usr/local/bin/act_runner ."
    echo "  puis placez-le dans $BINAIRE et relancez ce script."
    exit 1
  fi
  install -m 755 "$TMP/act_runner" "$BINAIRE"
  rm -rf "$TMP"
fi
"$BINAIRE" --version

# --- 3. Inscription auprès de MakeOne ----------------------------------------------------
dire "Inscription auprès de $MAKEONE"
CONFIG=$MAISON/config.yaml
if [ ! -f "$CONFIG" ]; then
  sudo -u "$UTILISATEUR" "$BINAIRE" generate-config > "$CONFIG"
  # Une tâche à la fois : deux déploiements ne se marchent jamais dessus.
  sed -i -E 's/^(\s*capacity:).*/\1 1/' "$CONFIG"
  chown "$UTILISATEUR": "$CONFIG"
fi
if [ ! -s "$MAISON/.runner" ]; then
  read -rsp "Jeton d'inscription MakeOne (Organisation → Paramètres → Actions → Exécuteurs) : " JETON && echo
  (cd "$MAISON" && sudo -u "$UTILISATEUR" "$BINAIRE" register --no-interactive \
    --config "$CONFIG" --instance "$MAKEONE" --token "$JETON" \
    --name "$NOM" --labels "$ETIQUETTE:host")
  unset JETON
fi
chmod 600 "$MAISON/.runner"

cat > /etc/systemd/system/makeone-executeur.service <<EOF
[Unit]
Description=Exécuteur MakeOne ($ETIQUETTE)
After=network-online.target
Wants=network-online.target

[Service]
User=$UTILISATEUR
WorkingDirectory=$MAISON
ExecStart=$BINAIRE daemon --config $CONFIG
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable -q --now makeone-executeur
systemctl restart makeone-executeur

# --- 4. Les droits du deployeur -----------------------------------------------------------
dire "Droits du deployeur"
REGLES=/etc/sudoers.d/makeone-deployeur
: > "$REGLES.tmp"
[ -f "$REGLES" ] && grep -v '^#' "$REGLES" >> "$REGLES.tmp" || true
SYSTEMCTL=$(command -v systemctl)
[ -n "$EMPREINTE" ] && SERVICES+=(empreinte-maj)
for service in "${SERVICES[@]}"; do
  for verbe in start restart status; do
    echo "$UTILISATEUR ALL=(root) NOPASSWD: $SYSTEMCTL $verbe $service.service" >> "$REGLES.tmp"
  done
  JOURNALCTL=$(command -v journalctl)
  echo "$UTILISATEUR ALL=(root) NOPASSWD: $JOURNALCTL -u $service.service *" >> "$REGLES.tmp"
done
{ echo "# Droits de l'exécuteur MakeOne (relier-makeone.sh)"; sort -u "$REGLES.tmp"; } > "$REGLES.nouveau"
rm -f "$REGLES.tmp"
chmod 440 "$REGLES.nouveau"
if visudo -cqf "$REGLES.nouveau"; then
  mv "$REGLES.nouveau" "$REGLES"
else
  rm -f "$REGLES.nouveau"
  echo "✘ Règles sudo invalides : rien n'est changé."
  exit 1
fi
grep -v '^#' "$REGLES" | sed 's/^/  /' || echo "  (aucun droit particulier)"
if [ "$DOCKER" = oui ]; then
  usermod -aG docker "$UTILISATEUR"
  echo "  + groupe docker (équivaut à root : ne l'utilisez que pour vos propres dépôts)"
  systemctl restart makeone-executeur
fi

# --- 5. Empreinte prend son code sur MakeOne --------------------------------------------
if [ -n "$EMPREINTE" ]; then
  dire "Empreinte → $EMPREINTE"
  MAISON_E=$(getent passwd empreinte | cut -d: -f6)
  DEPOT_E=$MAISON_E/empreinte-
  [ -d "$DEPOT_E/.git" ] || { echo "✘ Dépôt Empreinte introuvable dans $DEPOT_E"; exit 1; }
  HOTE=$(printf '%s' "$EMPREINTE" | sed -E 's#^https?://([^/]+)/.*#\1#')
  if ! grep -q "@$HOTE" "$MAISON_E/.git-credentials" 2>/dev/null; then
    read -rp "Nom d'utilisateur MakeOne du jeton : " QUI
    read -rsp "Jeton MakeOne en lecture seule (droit « dépôt : lecture ») : " JETON && echo
    printf 'https://%s:%s@%s\n' "$QUI" "$JETON" "$HOTE" >> "$MAISON_E/.git-credentials"
    unset JETON
    chown empreinte: "$MAISON_E/.git-credentials" && chmod 600 "$MAISON_E/.git-credentials"
  fi
  sudo -u empreinte git -C "$DEPOT_E" config credential.helper store
  ANCIENNE=$(sudo -u empreinte git -C "$DEPOT_E" remote get-url origin)
  sudo -u empreinte git -C "$DEPOT_E" remote set-url origin "$EMPREINTE"
  if sudo -u empreinte git -C "$DEPOT_E" fetch -q origin main; then
    echo "✔ Empreinte se met à jour depuis MakeOne (avant : $ANCIENNE)."
  else
    sudo -u empreinte git -C "$DEPOT_E" remote set-url origin "$ANCIENNE"
    echo "✘ MakeOne refuse l'accès : Empreinte reste branché sur $ANCIENNE."
    exit 1
  fi
fi

sleep 3
if systemctl is-active -q makeone-executeur; then
  cat <<EOF

✔ Ce serveur est relié à MakeOne : exécuteur « $NOM », étiquette « $ETIQUETTE ».
  Il doit apparaître « en ligne » dans MakeOne (Organisation → Paramètres → Actions → Exécuteurs).
  Journal : journalctl -u makeone-executeur -f
EOF
else
  echo "✘ L'exécuteur ne démarre pas : journalctl -u makeone-executeur -n 50"
  exit 1
fi
