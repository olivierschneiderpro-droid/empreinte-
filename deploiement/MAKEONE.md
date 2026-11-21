# Empreinte sur MakeOne

MakeOne (https://makeone.space) remplace GitHub : le code, les vérifications et les mises en
ligne. Le serveur des sites (celui de lavérité.tech) y est relié par un **exécuteur** : c'est
lui qui va chercher les tâches chez MakeOne, par une connexion sortante. Aucun port à ouvrir,
aucune clé SSH du serveur rangée chez MakeOne.

```
 MakeOne (makeone.space)            serveur des sites (lavérité.tech…)
 ─ dépôt empreinte-        ◀─────── exécuteur « sites » (utilisateur deployeur)
 ─ workflow Mise en ligne  ───────▶ sudo systemctl start empreinte-maj
                                    git fetch depuis MakeOne, archive installée
```

## 1. Relier le serveur (une fois)

1. Dans MakeOne : votre organisation → **Paramètres → Actions → Exécuteurs → Créer un
   exécuteur**, copiez le jeton d'inscription.
2. Créez aussi un jeton en **lecture seule** sur les dépôts (Paramètres → Applications), pour
   que le serveur récupère le code.
3. Sur le serveur des sites :

```bash
sudo bash /home/empreinte/empreinte-/scripts/relier-makeone.sh \
  --empreinte https://makeone.space/PROPRIETAIRE/empreinte-.git
```

Le script demande les deux jetons (ils ne s'affichent pas et ne sont jamais dans le dépôt),
installe l'exécuteur `makeone-executeur` et branche Empreinte sur MakeOne. S'il n'y arrive pas,
Empreinte reste branché sur GitHub.

## 2. Les autres sites et applications

Relancez le script avec les services que le deployeur a le droit de lancer ou redémarrer :

```bash
sudo bash relier-makeone.sh --autoriser mon-site --autoriser mon-api
```

Puis, dans le dépôt de chaque site, un `.gitea/workflows/deployer.yml` avec
`runs-on: sites` (modèle : celui d'Empreinte). Pour des sites en conteneurs, `--docker` donne
au deployeur l'accès à Docker, ce qui équivaut à root sur le serveur : à réserver à vos propres
dépôts.

## 3. Ce qui reste à faire à la main

- Recréer les secrets dans MakeOne (clé Android, mot de passe) : GitHub ne rend jamais leurs
  valeurs.
- Archiver le dépôt GitHub une fois que tout a tourné quelques semaines, puis seulement le
  supprimer.
- Licence GPL (héritée de Bible Strong) : garder `app/LICENSE` et pouvoir fournir les sources
  de l'app distribuée.
