# Illustrations Empreinte

Les illustrations reprennent l'esprit de celles de Bible Strong (personnes dessinées, posture et émotion),
mais avec nos propres personnes : de vraies anatomies (bras, mains, visages humains), de vraies
couleurs de peau et de cheveux, tous les âges (enfants, jeunes, adultes, aînés), hommes et femmes.

## Guide de style (à coller au début de chaque demande)

> Illustration éditoriale plate et propre, style semi-réaliste, anatomie humaine juste (proportions,
> bras, mains à cinq doigts, cou, épaules naturels), visages humains expressifs et doux, traits
> correspondant aux origines (nez, lèvres, yeux, forme du visage). Contours fins brun très foncé
> (#2A211D), aplats de couleur avec ombres douces et quelques reflets, sans dégradés photo.
> Couleurs de peau et de cheveux réelles. Les vêtements portent la couleur vive. Fond transparent,
> le personnage est contenu dans une forme douce et arrondie (pas de coupure nette en bas).
> Pas de texte, pas de logo. Format PNG, haute définition.

## Les personnes (diversité à respecter)

Pour chaque couleur de peau et chaque âge, prévoir un homme **et** une femme, dans des styles différents :
Afrique, Europe, Asie de l'Est, Maghreb et Moyen-Orient, Amérique latine ; enfant, jeune, adulte, aîné.
Hommes : mâchoire et menton plus larges, sourcils plus épais. Femmes : menton plus fin.
Aînés : rides, cheveux gris ou blancs. Enfants : visage rond, grands yeux.

## Une demande par illustration (fichier remplacé dans `app/apps/expo/src/assets/images/`)

| Fichier | Taille | Scène, émotion, mouvement |
|---|---|---|
| `home/illustrations/audibible-reader.png` | 1536 × 1024 | Femme maghrébine voilée (voile vert sombre), casque audio jaune, les yeux fermés, apaisée, la Bible fermée serrée contre son cœur ; ondes sonores et notes de musique discrètes. Fond transparent (posée sur une carte bleu nuit). |
| `new-tab/bible-reader.png` | 840 × 560 | Jeune homme noir, coiffure afro, sweat bleu, accoudé, la main sous le menton, lisant la Bible ouverte, pensif. |
| `new-tab/notes-writer.png` | 694 × 640 | Femme européenne, chignon châtain, pull ocre, écrit dans un carnet, concentrée. |
| `new-tab/library-reader.png` | 640 × 640 | Grand-père noir, barbe blanche, lunettes, gilet vert, rit doucement en lisant ; une pile de livres à côté. |
| `home/courses-videos.jpg` | 720 × 576 | Mère latine et son fils regardent une vidéo sur une tablette, émerveillés. Fond rose pâle. |
| `home/bible-project-plan.jpg` | 960 × 540 | Deux jeunes (une jeune femme noire afro, un jeune homme d'Asie de l'Est) marchent ensemble sur un chemin, Bible ouverte, joyeux. Fond turquoise pâle. |
| `home/bible-timeline.jpg` | 960 × 540 | Grand-père européen lit l'histoire biblique à sa petite-fille rousse émerveillée ; une frise du temps au-dessus. Fond sable. |
| `empty-state-illustration.png` | 640 × 640 | En gris uniquement : une enfant ouvre une boîte vide, curieuse (une icône sera posée dans la boîte). |
| `onboarding/online-choice.png` | 1341 × 1173 | Grand-mère noire et sa petite-fille partagent une Bible ; un nuage relié au livre par un fil. |
| `onboarding/offline-choice.png` | 1199 × 1312 | Jeune homme latino télécharge la Bible sur son téléphone, concentré. |
| `onboarding/comments-theologians.png` | 923 × 840 | Un aîné européen et une femme d'Asie du Sud discutent d'un passage, bulle de dialogue. |
| `onboarding/comparisons-proposal-3.png` | 1536 × 1024 | Un homme noir et une femme rousse comparent deux Bibles ouvertes ; flèches d'échange. |
| `onboarding/dictionary-proposal-2.png` | 1197 × 1315 | Jeune femme d'Asie de l'Est examine un mot à la loupe dans un grand livre, émerveillée. |
| `onboarding/references-proposal-2.png` | 1175 × 1339 | Homme maghrébin barbu lit, concentré ; des cartes de versets reliées par des pointillés. |
| `onboarding/themes-proposal-3.png` | 1331 × 1182 | Jeune femme voilée lève les mains de joie ; étiquettes colorées autour. |

Une fois les images obtenues, les déposer sous ces noms : l'app les utilise sans autre changement
(les trois images `new-tab/*` sont aujourd'hui en `.webp` : remplacer par des `.png` du même nom et
mettre à jour les deux `require` de `src/features/app-switcher/TabScreen/NewTab/`).

## État actuel : dessins de Bible Strong recolorés

En attendant de nouvelles illustrations, les quatorze images ci-dessus sont les dessins d'origine de
Bible Strong, inchangés, passés dans les teintes d'Empreinte (terre, sauge, ocre, nuit, prune, sable,
ardoise) par une carte de dégradé sur la luminosité. L'image Audio garde exactement son fond marine
(#10284D), celui de sa carte : seuls ses violets sont passés au bleu.
