# Empreinte sur le VPS (lavérité.tech)

Tout Empreinte tourne sur le VPS, en HTTPS :

| Adresse | Contenu |
|---|---|
| `https://lavérité.tech/` | le site de présentation |
| `https://lavérité.tech/app` | l'app web |
| `/comptes/…` | les comptes Empreinte (PocketBase, sur le VPS) |
| `/livres/…` | les livres chrétiens (Gutenberg + LibriVox, gardés en cache) |
| `/v1/…`, `/youversion/…` | le relais des ressources bibliques et de YouVersion |

Caddy est placé devant : il obtient et renouvelle le certificat HTTPS tout seul.
Le serveur Empreinte n'écoute que sur le VPS lui-même (`127.0.0.1:8080`).

Sous la forme technique utilisée par le DNS et le certificat, le domaine s'écrit
`xn--lavrit-dvad.tech`.

## 1. Le DNS (chez le vendeur du domaine)

Créez deux enregistrements **A** vers l'adresse du VPS :

| Nom | Type | Valeur |
|---|---|---|
| `@` | A | `168.231.85.13` |
| `www` | A | `168.231.85.13` |

Supprimez les anciens enregistrements A ou AAAA de `@` et `www`, s'il y en a.
`www.lavérité.tech` renvoie vers `lavérité.tech`.

## 2. L'installation (sur le VPS, une seule fois)

```sh
ssh root@168.231.85.13
curl -fsSL https://raw.githubusercontent.com/olivierschneiderpro-droid/empreinte-/main/scripts/installer-vps.sh -o installer-vps.sh
bash installer-vps.sh lavérité.tech votre@courriel.fr
```

Le courriel sert à Let's Encrypt, pour prévenir si un certificat pose problème.

Le script installe :
- Node.js, Caddy, le pare-feu (SSH, HTTP et HTTPS seulement) ;
- l'utilisateur `empreinte`, le dépôt et la version web ;
- les services suivants :
  - `empreinte` : le serveur ;
  - `empreinte-maj.timer` : les mises à jour toutes les 30 secondes, comme sur le HP ;
  - `empreinte-sauvegarde.timer` : la sauvegarde des comptes chaque nuit à 3 h 30, 14 jours gardés dans `/home/empreinte/sauvegardes`.

On peut le relancer sans risque : il remet tout en ordre.

## 3. Les comptes du HP (sur le HP, une seule fois)

```sh
cd ~/empreinte-   # le dépôt sur le HP
git pull
bash scripts/migrer-vers-vps.sh root@168.231.85.13
```

Le script :
1. arrête Empreinte sur le HP, pour que personne ne s'inscrive pendant la copie ;
2. envoie au VPS les comptes, la clé YouVersion et les livres déjà en cache ;
3. relance Empreinte sur le VPS.

Le HP garde toutes ses données, en secours. Pour le rallumer :
`sudo systemctl enable --now empreinte empreinte-maj.timer`.

## 4. La console des comptes

Elle n'est jamais ouverte sur Internet : Caddy la refuse, et le serveur refuse aussi toute
demande relayée. On l'ouvre par un tunnel SSH, depuis son ordinateur :

```sh
ssh -L 8080:127.0.0.1:8080 root@168.231.85.13
```

Puis on ouvre `http://localhost:8080/comptes/_/` dans le navigateur.

Dans la console, réglez :
- **Settings → Application** : l'adresse `https://lavérité.tech`.
- **Settings → Mail settings** : un serveur d'envoi (SMTP), pour « Mot de passe oublié ».

## Au quotidien

| Pour | Commande (sur le VPS) |
|---|---|
| Voir les journaux | `journalctl -u empreinte -f` |
| Voir les mises à jour | `journalctl -u empreinte-maj -f` |
| Redémarrer | `systemctl restart empreinte` |
| Sauvegarder maintenant | `systemctl start empreinte-sauvegarde` |
| Ajouter la clé YouVersion | `nano /home/empreinte/.empreinte-cles` (`YOUVERSION_KEY=…`), puis `systemctl restart empreinte` |

**Sécurité conseillée :** connectez-vous en SSH avec une clé plutôt qu'un mot de passe
(`ssh-copy-id root@168.231.85.13`). Désactivez ensuite les mots de passe dans
`/etc/ssh/sshd_config`, en laissant une session ouverte pendant l'essai pour ne pas vous
enfermer dehors.

**Pas encore sur le VPS :**
- le serveur de textes bibliques propre à Empreinte (`resource-service` + Postgres) : les
  textes passent encore par le relais `/v1` ;
- le « Monde » (prévu pour Cloudflare).

Ce sont les deux étapes suivantes.
