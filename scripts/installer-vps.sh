#!/usr/bin/env bash
# Installe Empreinte en entier sur un VPS Ubuntu ou Debian neuf, en HTTPS :
#   - l'app web (/app), le site de présentation (/), les comptes (PocketBase, /comptes),
#     les livres (/livres), le relais des ressources bibliques ;
#   - Caddy devant, avec le certificat HTTPS automatique (Let's Encrypt) ;
#   - le pare-feu (SSH, HTTP, HTTPS seulement) ;
#   - les mises à jour automatiques (toutes les 30 s, comme sur le HP) ;
#   - une sauvegarde des comptes chaque nuit (14 jours gardés).
#
# À lancer une fois, en root, sur le VPS :
#   sudo bash installer-vps.sh lavérité.tech [courriel-pour-lets-encrypt]
# Relancer le script ne casse rien : il remet tout en ordre.
set -euo pipefail

DOMAINE_SAISI=${1:?"Usage : sudo bash $0 <domaine> [courriel]"}
COURRIEL=${2:-}
UTILISATEUR=empreinte
DEPOT=${DEPOT:-https://github.com/olivierschneiderpro-droid/empreinte-.git}
PORT=8080

[ "$(id -u)" = 0 ] || { echo "À lancer en root : sudo bash $0 $*"; exit 1; }
dire() { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }
export DEBIAN_FRONTEND=noninteractive

dire "Paquets du système"
apt-get update -q
apt-get install -y -q curl git ufw sqlite3 ca-certificates python3 tar gnupg

# Domaine avec accents (lavérité.tech) → forme ASCII pour le DNS et le certificat.
DOMAINE=$(python3 -c 'import sys; print(sys.argv[1].strip().lower().encode("idna").decode())' "$DOMAINE_SAISI")

dire "Node.js 20 ou plus"
version_node() { node -v 2>/dev/null | sed 's/^v\([0-9]*\).*/\1/' || echo 0; }
if [ "$(version_node)" -lt 20 ] 2>/dev/null; then
  apt-get install -y -q nodejs || true
fi
if [ "$(version_node)" -lt 20 ] 2>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -q nodejs
fi
node -v

dire "Caddy (HTTPS automatique)"
if ! command -v caddy >/dev/null; then
  apt-get install -y -q caddy || {
    curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key |
      gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt \
      > /etc/apt/sources.list.d/caddy-stable.list
    apt-get update -q && apt-get install -y -q caddy
  }
fi

dire "Utilisateur « $UTILISATEUR » et dépôt"
id "$UTILISATEUR" >/dev/null 2>&1 || useradd -m -s /bin/bash "$UTILISATEUR"
MAISON=$(getent passwd "$UTILISATEUR" | cut -d: -f6)
ICI=$MAISON/empreinte-
DEST=$MAISON/empreinte-web
en_empreinte() { sudo -u "$UTILISATEUR" -H env "$@"; }
if [ -d "$ICI/.git" ]; then
  en_empreinte git -C "$ICI" pull -q --ff-only || echo "Dépôt local modifié : laissé tel quel."
else
  en_empreinte git clone -q "$DEPOT" "$ICI"
fi
# Clés des services (YOUVERSION_KEY=…) : hors du dépôt public, lisibles par Empreinte seul.
CLES=$MAISON/.empreinte-cles
[ -f "$CLES" ] || install -m 600 -o "$UTILISATEUR" -g "$UTILISATEUR" /dev/null "$CLES"

dire "Version web"
en_empreinte DEST="$DEST" bash "$ICI/scripts/mise-a-jour-hp.sh" || true
if [ ! -f "$DEST/index.html" ]; then
  TMP=$(mktemp -d)
  tar xzf "$ICI/deploiement/empreinte-web.tar.gz" -C "$TMP"
  rm -rf "$DEST" && mv "$TMP/empreinte-web-hp" "$DEST" && rm -rf "$TMP"
  chown -R "$UTILISATEUR:$UTILISATEUR" "$DEST"
fi

dire "Services systemd"
cat > /etc/systemd/system/empreinte.service <<EOF
[Unit]
Description=Empreinte (app, site, comptes, livres)
After=network-online.target
Wants=network-online.target

[Service]
User=$UTILISATEUR
Environment=HOTE=127.0.0.1
EnvironmentFile=-$CLES
ExecStart=$(command -v node) $ICI/scripts/servir-empreinte.mjs $DEST $PORT
Restart=always
RestartSec=1

[Install]
WantedBy=multi-user.target
EOF
cat > /etc/systemd/system/empreinte-maj.service <<EOF
[Unit]
Description=Empreinte : récupérer la dernière version
After=network-online.target

[Service]
Type=oneshot
User=$UTILISATEUR
Environment=DEST=$DEST HOME=$MAISON
ExecStart=/usr/bin/env bash $ICI/scripts/mise-a-jour-hp.sh
EOF
cat > /etc/systemd/system/empreinte-maj.timer <<EOF
[Unit]
Description=Empreinte : vérifier les mises à jour toutes les 30 secondes

[Timer]
OnBootSec=30s
OnUnitActiveSec=30s
AccuracySec=1s

[Install]
WantedBy=timers.target
EOF
cat > /etc/systemd/system/empreinte-sauvegarde.service <<EOF
[Unit]
Description=Empreinte : sauvegarde des comptes

[Service]
Type=oneshot
User=$UTILISATEUR
Environment=HOME=$MAISON
ExecStart=/usr/bin/env bash $ICI/scripts/sauvegarder-comptes.sh
EOF
cat > /etc/systemd/system/empreinte-sauvegarde.timer <<EOF
[Unit]
Description=Empreinte : sauvegarde des comptes chaque nuit

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=true

[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now empreinte empreinte-maj.timer empreinte-sauvegarde.timer
systemctl restart empreinte

dire "Caddy pour https://$DOMAINE_SAISI"
{
  [ -n "$COURRIEL" ] && printf '{\n\temail %s\n}\n\n' "$COURRIEL"
  cat <<EOF
$DOMAINE {
	encode zstd gzip
	# La console d'administration des comptes n'est jamais ouverte sur Internet :
	# on y accède par un tunnel SSH (voir deploiement/VPS.md).
	@console path /comptes/_ /comptes/_/*
	respond @console 403
	reverse_proxy 127.0.0.1:$PORT
}

www.$DOMAINE {
	redir https://$DOMAINE{uri} permanent
}
EOF
} > /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null
systemctl enable caddy >/dev/null 2>&1 || true
systemctl reload caddy 2>/dev/null || systemctl restart caddy

dire "Pare-feu"
ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443 >/dev/null
ufw --force enable >/dev/null
ufw status | sed -n '1,12p'

dire "Vérifications"
IP=$(curl -fsS -4 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')
DNS=$(getent ahostsv4 "$DOMAINE" 2>/dev/null | awk 'NR==1{print $1}')
for i in $(seq 1 20); do curl -fsS "http://127.0.0.1:$PORT/app" -o /dev/null && break; sleep 1; done
curl -fsS "http://127.0.0.1:$PORT/app" -o /dev/null && echo "✔ Empreinte répond sur le VPS." ||
  echo "✘ Empreinte ne répond pas encore : journalctl -u empreinte -n 50"
if [ "$DNS" = "$IP" ]; then
  echo "✔ $DOMAINE_SAISI pointe vers ce VPS ($IP) : le certificat HTTPS se crée tout seul."
else
  echo "⚠ $DOMAINE_SAISI pointe vers « ${DNS:-rien} », pas vers ce VPS ($IP)."
  echo "  Chez le vendeur du domaine, créez deux enregistrements A : « @ » et « www » → $IP."
  echo "  Caddy obtiendra le certificat dès que le DNS sera à jour (rien à relancer)."
fi
cat <<EOF

Empreinte : https://$DOMAINE_SAISI  (app : https://$DOMAINE_SAISI/app)
Clé YouVersion : ajoutez « YOUVERSION_KEY=… » dans $CLES puis « systemctl restart empreinte ».
Comptes du HP : lancez scripts/migrer-vers-vps.sh depuis le HP (voir deploiement/VPS.md).
Journaux : journalctl -u empreinte -f   ·   Mises à jour : journalctl -u empreinte-maj -f
EOF
