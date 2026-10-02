#!/usr/bin/env python3
"""Renomme « Bible Strong » en « Empreinte » dans tout le fork (app/).

Ce qui change : textes affichés, noms de paquets (@bible-strong/* → @empreinte/*),
identifiants de code, fichiers et dossiers.

Ce qui reste, parce que ce sont des réalités extérieures et non des noms :
- les adresses des services en ligne (api.bible-strong.app, projet Firebase
  bible-strong-app…), dont dépend le chargement des Bibles ;
- les formats de données renvoyés par ces services (bible-strong-canonical-…,
  préfixe « bible-strong: ») ;
- les identifiants natifs liés aux magasins et à Firebase (com.smontlouis.biblestrong…) ;
- les licences, mentions de copyright et la provenance des droits
  (bibleStrongAuthorization : droits accordés à Bible Strong).
"""
import os
import re
import sys

RACINE = sys.argv[1] if len(sys.argv) > 1 else 'app'
IGNORES = {'node_modules', '.git', '.yarn', '.scratch', 'Pods', 'build', '.expo', 'dist'}
TEXTE = {
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.html', '.css',
    '.yml', '.yaml', '.toml', '.txt', '.kt', '.kts', '.swift', '.m', '.h', '.podspec',
    '.gradle', '.xml', '.plist', '.sh', '.py', '.env', '.example', '.lock', '.sql', '.pen',
    '.astro', '.svg', '.rb', '.properties', '.webmanifest',
}

# Réalités extérieures : protégées avant tout remplacement.
PROTEGES = [
    r'(?<![\w.-])[\w.-]*bible-strong[\w.-]*\.(?:app|com|dev|net|org|io)\b',
    r'\bbible-strong-app\b[\w.-]*',
    r'smontlouis/bible-strong[\w.-]*',
    r'fr\.bible\.strong',
    r'com\.smontlouis\.biblestrong[\w.]*',
    r'save\.biblestrong',
    r'bible-strong-(?!archive)[a-z0-9]+(?:-[a-z0-9]+)*',  # formats de données du serveur
    r'bible-strong:',
    r'bibleStrongAuthorization',
    r'BibleStrong authoriz\w*',
    r'(?m)^[^\n]*(?:Copyright|©|GPL|Licen[cs]e|licen[cs]e|Montlouis|smontlouis)[^\n]*$',
]

# Phrases où « Bible Strong » désigne la Bible annotée des numéros Strong.
PHRASES = [
    ('Choisir l’affichage de la Bible Strong', 'Choisir l’affichage de la Bible annotée Strong'),
    ('Choisir une Bible Strong', 'Choisir une Bible annotée Strong'),
    ('Bible Strong disponible sélectionnée', 'Bible annotée Strong disponible sélectionnée'),
    ('(Bible Strong par défaut)', '(Bible annotée Strong par défaut)'),
    ('Bible Strong par défaut', 'Bible annotée Strong par défaut'),
    ('Bible Strong index', 'Strong-annotated Bible index'),
]

# Remplacements de la marque, du plus précis au plus général.
MARQUE = [
    ('fonctionnalités de la Bible Strong', 'fonctionnalités d’Empreinte'),
    ('de la Bible Strong', 'd’Empreinte'),
    ('à la Bible Strong', 'à Empreinte'),
    ('la Bible Strong', 'Empreinte'),
    ('the Bible Strong', 'Empreinte'),
    (' de Bible Strong', ' d’Empreinte'),
    ('Bible Strong', 'Empreinte'),
    ('Bible strong', 'Empreinte'),
    ('BIBLE STRONG', 'EMPREINTE'),
    ('@bible-strong/', '@empreinte/'),
    ('bible-strong-archive', 'empreinte-archive'),
    ('biblestrongarchive', 'empreintearchive'),
    ('BibleStrongArchive', 'EmpreinteArchive'),
    ('withBibleStrongArchiveKeys', 'withEmpreinteArchiveKeys'),
    ('jestBibleStrongArchiveMock', 'jestEmpreinteArchiveMock'),
    ('BIBLE_STRONG_ARCHIVE_KEYS', 'EMPREINTE_ARCHIVE_KEYS'),
    ('__BIBLE_STRONG_AGENT_LOGS__', '__EMPREINTE_AGENT_LOGS__'),
    ('__bibleStrongFirestoreDeleteField__', '__empreinteFirestoreDeleteField__'),
    ('BibleStrongResourceStudio', 'EmpreinteResourceStudio'),
    ('BibleStrongCommentaryAudit', 'EmpreinteCommentaryAudit'),
    ('BibleStrongEGWImporter', 'EmpreinteEGWImporter'),
    ('installBibleStrongSidecar', 'installEmpreinteSidecar'),
    ('devBibleStrong', 'devEmpreinte'),
    ('bibleStrongState', 'empreinteState'),
    ('Bible_Strong__', 'Empreinte__'),
    ('bible_strong', 'empreinte'),
    # Fonction « Strong dans la Bible » : le sens est gardé, sans la marque.
    ('BibleStrongReference', 'StrongVerseReference'),
    ('BibleStrongRef', 'StrongVerseRef'),
    ('multiBibleStrongGoal', 'multiStrongBibleGoal'),
    ('multi-bible-strong', 'multi-strong-bible'),
    ('GET_BIBLE_STRONG', 'GET_STRONG_BIBLE'),
    ('VIEW_BIBLE_STRONG', 'VIEW_STRONG_BIBLE'),
    ('SELECT_BIBLE_STRONG', 'SELECT_STRONG_BIBLE'),
    ('bible-strong-desktop', 'empreinte-desktop'),
    ('BibleStrong', 'Empreinte'),
    ('bibleStrong', 'empreinte'),
]


def renommer(texte):
    gardes = []

    def garder(m):
        gardes.append(m.group(0))
        return f'\x00{len(gardes) - 1}\x00'

    if not re.search(r'(?i)bible[ _-]?strong|biblestrong', texte):
        return texte
    for motif in PROTEGES:
        texte = re.sub(motif, garder, texte)
    for avant, apres in PHRASES + MARQUE:
        texte = texte.replace(avant, apres)
    return re.sub('\x00(\\d+)\x00', lambda m: gardes[int(m.group(1))], texte)


def nom_fichier(nom):
    for avant, apres in MARQUE:
        nom = nom.replace(avant, apres)
    return nom


def main():
    changes = 0
    for dossier, sous, fichiers in os.walk(RACINE):
        sous[:] = [d for d in sous if d not in IGNORES]
        for f in fichiers:
            if f.startswith('LICENSE') or f.startswith('COPYING'):
                continue
            chemin = os.path.join(dossier, f)
            ext = os.path.splitext(f)[1]
            if ext not in TEXTE and not f.startswith('.env') and f not in ('yarn.lock', 'Podfile'):
                continue
            if 'firebase-adminsdk' in f:
                continue
            if os.path.getsize(chemin) > 2_000_000:
                continue
            try:
                avant = open(chemin, encoding='utf-8').read()
            except (UnicodeDecodeError, OSError):
                continue
            apres = renommer(avant)
            if apres != avant:
                open(chemin, 'w', encoding='utf-8').write(apres)
                changes += 1
    print('fichiers modifiés :', changes)

    # Fichiers et dossiers (du plus profond au moins profond).
    deplaces = 0
    for dossier, sous, fichiers in os.walk(RACINE, topdown=False):
        if any(p in IGNORES for p in dossier.split(os.sep)):
            continue
        for nom in fichiers + sous:
            if nom in IGNORES or 'firebase-adminsdk' in nom:
                continue
            nouveau = nom_fichier(nom)
            if nouveau != nom:
                os.rename(os.path.join(dossier, nom), os.path.join(dossier, nouveau))
                deplaces += 1
    print('fichiers ou dossiers renommés :', deplaces)


if __name__ == '__main__':
    main()
