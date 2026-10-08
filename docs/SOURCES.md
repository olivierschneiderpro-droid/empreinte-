# Sources ouvertes pour Empreinte

Inventaire des ressources gratuites ou libres qu'Empreinte peut brancher, par domaine.
**Rien n'est branché sans validation.** Pour chaque source : ce qu'elle apporte, sa licence
telle que trouvée (à confirmer à la source avant de brancher), et son état dans Empreinte.

Règles d'Empreinte appliquées à cet inventaire :
- **Pas de représentation de Jésus** : les films et images qui le représentent sont écartés.
- **La Parole n'est pas commerciale** : plusieurs sources (BibleProject, Bible Brain…) interdisent
  tout usage payant ; elles restent gratuites dans Empreinte.
- Une ressource n'est pas la Parole : chaque contenu renvoie au texte biblique.

État : ✅ déjà dans Empreinte · 🟢 prête à brancher · 🟡 à vérifier ou à demander · ⛔ écartée

## 1. Textes bibliques

| Source | Apport | Licence | État |
|---|---|---|---|
| API de ressources héritée de Bible Strong (`api.bible-strong.app`, par le relais du HP) | 40+ versions, Strong, Nave, dictionnaire, commentaires, chronologie | Service de Bible Strong | ✅ (dépendance à remplacer à terme) |
| [eBible.org](https://ebible.org/fraLSG/copyright.htm) | Louis Segond 1910 et des centaines de traductions (USFM, JSON, ePub) | LSG 1910 : domaine public ; autres : par traduction | 🟢 |
| [Free Use Bible API (AO Lab)](https://github.com/HelloAOLab/bible-api) | 1 250+ traductions en JSON, sans clé, auto-hébergeable | Code MIT ; droits par traduction (≈ 100 vraiment libres) | 🟢 pour les traductions libres |
| [bible-api.com](https://bible-api.com) | Versets par référence, sans clé | Traductions libres (surtout anglaises) | 🟡 |
| [YouVersion Platform](https://platform.youversion.com) | Versions, versets, plans de lecture | Clé d'application (côté serveur, dans `~/.empreinte-cles`) | 🟡 relais en place, plans à afficher |

## 2. Langues originales et données d'étude

| Source | Apport | Licence | État |
|---|---|---|---|
| [Open Scriptures Hebrew Bible](https://hb.openscriptures.org/) | Hébreu (WLC), lemmes, morphologie | Texte : domaine public ; données : CC BY 4.0 | 🟢 |
| [MorphGNT](https://jtauber.com/blog/2011/01/18/rebasing-morphgnt-off-sblgnt) / [SBLGNT](https://en.wikipedia.org/wiki/SBL_Greek_New_Testament) | Grec, morphologie | MorphGNT : CC BY-SA ; SBLGNT : licence propre (non revendable) | 🟢 (gratuit) |
| [STEPBible Data (Tyndale House)](https://github.com/STEPBible/STEPBible-Data) | Lexiques, versification, étiquetage | CC BY 4.0 (sauf fichiers « NC ») | 🟢 |
| [MACULA (Clear Bible)](https://github.com/Clear-Bible) | Grec et hébreu annotés (Strong, lemmes) | CC BY 4.0 | 🟢 |
| [OpenBible.info – références croisées](https://www.openbible.info/labs/cross-references/) | ~345 000 renvois classés | CC BY | 🟢 |
| [OpenBible.info – géographie](https://github.com/openbibleinfo/Bible-Geocoding-Data) | Lieux bibliques géolocalisés (cartes) | CC BY 4.0 | 🟢 |
| [Theographic Bible Metadata](https://theographic.notion.site) | Personnes, lieux, événements, 53 000 liens | CC BY-SA 4.0 | 🟢 (chronologie, Nave) |

## 3. Audio de la Bible

| Source | Apport | Licence | État |
|---|---|---|---|
| Audio hérité de Bible Strong (lecteur actuel) | Écoute chapitre par chapitre | Service de Bible Strong | ✅ |
| [Bible Brain (Faith Comes By Hearing)](https://www.faithcomesbyhearing.com/audio-bible-resources/bible-brain) | Bible audio dans des milliers de langues, texte et vidéo | Gratuit, clé sur demande, usage non payant | 🟡 clé à demander |
| [BibleAudio – Segond 1910 MP3](https://bibleaudio.gumroad.com/l/bible-louis-segond-1910-mp3) | Bible entière lue en français (173 fichiers) | Gratuit ; droits de la lecture à confirmer | 🟡 |

## 4. Vidéos et enseignements

| Source | Apport | Licence | État |
|---|---|---|---|
| [BibleProject](https://bibleproject.com/terms/) (FR : [bibleproject.com/francais](https://bibleproject.com/francais/)) | Vidéos par livre et par thème, en 55 langues | Gratuit, intégration YouTube, sans modification, sans profit, crédit obligatoire | ✅ (cours et vidéos) |
| YouTube Data API | Recherche de vidéos, prédications, lives | Clé Google (vous la fournirez) | 🟡 |
| API Dailymotion | Recherche de vidéos | Ouverte | 🟢 |
| [SermonAudio](https://api.sermonaudio.com) | Plus grande bibliothèque de prédications audio | API documentée, conditions à vérifier | 🟡 |

## 5. Films chrétiens

| Source | Apport | Licence | État |
|---|---|---|---|
| Internet Archive (films anciens du domaine public) | Films bibliques et biographiques anciens | Domaine public selon chaque film | 🟡 tri à faire |
| Gospel Films Archive | Films chrétiens du XXᵉ siècle restaurés | Chaîne gratuite (accord à demander) | 🟡 |
| Biographies (Luther, missionnaires…) | Films sans représentation de Jésus | Selon chaque film | 🟡 |
| JESUS Film, The Chosen, Lumo | Vie de Jésus | Représentent Jésus | ⛔ |

## 6. Chants et musique

| Source | Apport | Licence | État |
|---|---|---|---|
| [Hymnary.org](https://en.wikipedia.org/wiki/Hymnary.org) (Calvin University, CCEL) | 1 million de cantiques ; textes complets quand ils sont libres | Domaine public par chant | 🟢 pour les chants libres |
| Recueils francophones anciens (*Sur les ailes de la foi*, 1928…) | Cantiques en français | Selon la date de décès de chaque auteur | 🟡 chant par chant |
| Musique libre (Creative Commons, Musopen, Free Music Archive) | Musique douce pour la méditation et la prière | CC selon chaque morceau | 🟢 |

## 7. Livres chrétiens

| Source | Apport | Licence | État |
|---|---|---|---|
| [Christian Classics Ethereal Library (CCEL)](https://ccel.org) | Classiques chrétiens (Augustin, Calvin, Bunyan, Spurgeon…) | Domaine public pour la plupart | 🟢 |
| [Project Gutenberg](https://gutenberg.org/ebooks/42657) | Livres anciens en ePub (Spurgeon, Bunyan…) | Domaine public (États-Unis) | 🟢 |
| [LibriVox](https://librivox.org/author/4196) | Livres audio lus par des bénévoles (Bunyan, Spurgeon…) | Domaine public (États-Unis) | 🟢 |
| [Monergism](https://www.monergism.com) / [Classic Christian Library](https://classicchristianlibrary.com/) | Ebooks réformés gratuits, commentaires anciens | Gratuits ; droits par livre | 🟡 |
| Wikisource FR, Gallica (BnF) | Textes chrétiens anciens en français (Calvin, Pascal…) | Domaine public | 🟢 |

## 8. Jeunesse et images

| Source | Apport | Licence | État |
|---|---|---|---|
| [Bible for Children](https://bibleforchildren.org) | Histoires bibliques illustrées pour enfants, en français | Diffusion libre et gratuite (conditions à confirmer) | 🟡 |
| [Free Bible Images](https://www.freebibleimages.org/help/reuse/) | Séries d'images bibliques | Licence propre à chaque série | 🟡 série par série |
| Wikimedia Commons | Œuvres d'art anciennes | Domaine public | 🟢 hors représentations de Jésus |

## Prochaines étapes proposées
1. Brancher en premier ce qui est libre et utile tout de suite : LSG 1910 (eBible), références
   croisées et lieux (OpenBible), livres et livres audio du domaine public (CCEL, Gutenberg,
   LibriVox), chants libres (Hymnary).
2. Demander les clés : Bible Brain (audio), YouTube (vidéos), et confirmer les conditions de
   SermonAudio et Bible for Children.
3. Trier les films du domaine public (sans représentation de Jésus).
