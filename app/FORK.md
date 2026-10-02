# Fork d’Empreinte

Ce dossier est un fork complet de [Empreinte](https://github.com/smontlouis/bible-strong)
(licence GPL-3.0, © Stéphane Montlouis et contributeurs), importé depuis le commit
`76b2a04dc29786b9c67c7edf0bbdcbb96aca481b`.

Rien n'a été retiré : l'application, le site, les outils, les ressources et les données
sont conservés tels quels. Empreinte vient s'y ajouter et lui donner sa nouvelle identité.

## Identité Empreinte dans le code

- Thème par défaut repeint en « Lumière » (`src/themes/colors.ts`) ; les autres thèmes sont intacts.
- Polices Geist, Geist Mono et Doto (licence SIL OFL 1.1, via `@expo-google-fonts`) dans `src/assets/fonts/`.
- Module `src/features/empreinte/` et routes `app/empreinte/` : réalités, fiche, vérification, intégration.
- Carte Empreinte ajoutée en tête des accueils mobile et bureau ; tous les blocs d’Empreinte restent.
- Le moteur `packages/core` est résolu par metro (`metro.config.js`).
