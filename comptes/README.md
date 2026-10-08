# Comptes Empreinte

Les comptes d'Empreinte vivent sur le serveur (le HP), et non plus chez Bible Strong.

- Le moteur est **PocketBase** (un seul programme, base SQLite). `scripts/servir-empreinte.mjs`
  le télécharge au premier démarrage dans `~/empreinte-comptes/`, le lance sur
  `127.0.0.1:8090` et le relance s'il s'arrête. Rien à installer à la main.
- L'app le joint par le même serveur : `/comptes/…` est relayé vers PocketBase.
- Les données sont dans `~/empreinte-comptes/pb_data` : **c'est ce dossier qu'il faut
  sauvegarder**.
- La structure de la base est décrite dans `pb_migrations/` et appliquée automatiquement.
- La console d'administration (`/comptes/_/`) n'est ouverte que depuis le HP lui-même
  (`http://localhost:8080/comptes/_/`). À la première visite, elle demande de créer le compte
  administrateur.
- Envoi des e-mails (mot de passe oublié) : à régler dans la console, *Settings → Mail
  settings* (serveur SMTP).
