// Empreinte · Chants : cantiques du domaine public et enregistrements sous licence libre.
// Le catalogue (titres, auteurs, paroles libres) est choisi à la main dans l'app ; le serveur
// cherche pour chaque chant des enregistrements libres sur Wikimedia Commons et Internet
// Archive, vérifie leur licence (domaine public ou Creative Commons) et garde le résultat en
// cache (~/empreinte-chants) : l'app ne parle qu'à ce serveur.
//
//   GET /chants/api/chant/<id>   → { id, enregistrements: [...], enCours }
//   GET /chants/api/decouvrir    → { enregistrements: [...] }  (autres cantiques libres)
import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const COMMONS = "https://commons.wikimedia.org/w/api.php";
const ARCHIVE = "https://archive.org";
const AGENT = {
  "User-Agent": "Empreinte/1.0 (application biblique ; cantiques du domaine public)",
};
const UNE_SEMAINE = 7 * 24 * 3600 * 1000;

const normaliser = (texte) =>
  (texte ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sansBalises = (html) =>
  (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const json = async (url, fetchImpl, ms = 25000) => {
  const reponse = await fetchImpl(url, {
    headers: AGENT,
    signal: AbortSignal.timeout(ms),
  });
  if (!reponse.ok) throw new Error(`${new URL(url).host} : ${reponse.status}`);
  return reponse.json();
};

/** Licence acceptée : domaine public, CC0 ou Creative Commons (diffusion permise). */
export const licenceLibre = (texte) => {
  const t = (texte ?? "").toLowerCase();
  return (
    /public ?domain|domaine public|publicdomain|\bpd\b|cc0|creativecommons|\bcc[- ]by/.test(t) &&
    !/all rights reserved/.test(t)
  );
};

/** Nom lisible d'une licence à partir de son adresse ou de son nom court. */
export const nomLicence = (texte) => {
  const t = (texte ?? "").toLowerCase();
  if (/cc0|zero/.test(t)) return "CC0";
  if (/public ?domain|publicdomain|\bpd\b|mark/.test(t)) return "Domaine public";
  const m = t.match(/(by(?:-nc)?(?:-sa|-nd)?)(?:\/|\s|-)?(\d\.\d)?/);
  if (/creativecommons|cc[- ]by/.test(t) && m)
    return `CC ${m[1].toUpperCase()}${m[2] ? ` ${m[2]}` : ""}`;
  return texte ?? "";
};

/** Points de ressemblance entre un titre trouvé et les mots recherchés. */
export const ressemblance = (titre, recherche) => {
  const mots = normaliser(recherche).split(" ").filter((m) => m.length > 2);
  if (!mots.length) return 0;
  const cible = ` ${normaliser(titre)} `;
  return mots.filter((m) => cible.includes(` ${m} `)).length / mots.length;
};

const AUDIO_COMMONS = /^(audio\/(ogg|mpeg|mp3|wav|x-wav|webm|flac|opus)|application\/ogg)/;

/** Enregistrements libres sur Wikimedia Commons (licence lue dans les métadonnées). */
export const chercherCommons = async (recherche, fetchImpl, limite = 12) => {
  const url =
    `${COMMONS}?action=query&format=json&origin=*&generator=search&gsrnamespace=6` +
    `&gsrlimit=${limite}&gsrsearch=${encodeURIComponent(`${recherche} filetype:audio`)}` +
    "&prop=imageinfo&iiprop=url|mime|extmetadata";
  const data = await json(url, fetchImpl);
  return Object.values(data?.query?.pages ?? {})
    .map((page) => {
      const info = page.imageinfo?.[0];
      const meta = info?.extmetadata ?? {};
      const licence = meta.LicenseShortName?.value ?? meta.License?.value ?? "";
      return {
        titre: sansBalises(meta.ObjectName?.value) || page.title.replace(/^File:|\.[a-z0-9]+$/gi, ""),
        auteur: sansBalises(meta.Artist?.value).slice(0, 120),
        licence: nomLicence(licence),
        libre: licenceLibre(licence) || licenceLibre(meta.LicenseUrl?.value),
        url: info?.url,
        mime: info?.mime ?? "",
        page: info?.descriptionurl,
        source: "Wikimedia Commons",
      };
    })
    .filter((e) => e.url && e.libre && AUDIO_COMMONS.test(e.mime));
};

/** Enregistrements libres sur Internet Archive (licence déclarée par l'élément). */
export const chercherArchive = async (requete, fetchImpl, limite = 6) => {
  const q = `(${requete}) AND mediatype:audio AND (licenseurl:*publicdomain* OR licenseurl:*creativecommons*)`;
  const url =
    `${ARCHIVE}/advancedsearch.php?q=${encodeURIComponent(q)}` +
    "&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=licenseurl&sort[]=downloads+desc" +
    `&rows=${limite}&output=json`;
  const data = await json(url, fetchImpl);
  const docs = data?.response?.docs ?? [];
  const resultats = [];
  for (const doc of docs) {
    if (!licenceLibre(doc.licenseurl)) continue;
    try {
      const meta = await json(`${ARCHIVE}/metadata/${doc.identifier}`, fetchImpl);
      const fichiers = (meta.files ?? []).filter(
        (f) => /mp3$/i.test(f.name) && !/_64kb|sample/i.test(f.name),
      );
      for (const f of fichiers.slice(0, 40)) {
        resultats.push({
          titre: f.title || doc.title,
          album: doc.title,
          auteur: [].concat(f.creator ?? f.artist ?? doc.creator ?? []).join(", ").slice(0, 120),
          licence: nomLicence(doc.licenseurl),
          url: `${ARCHIVE}/download/${doc.identifier}/${f.name.split("/").map(encodeURIComponent).join("/")}`,
          page: `${ARCHIVE}/details/${doc.identifier}`,
          source: "Internet Archive",
        });
      }
    } catch {
      // Un élément qui ne répond pas n'empêche pas les autres.
    }
  }
  return resultats;
};

/** Les meilleurs enregistrements d'un chant : ceux dont le titre lui ressemble le plus. */
export const choisir = (enregistrements, recherche, nombre = 4) => {
  const vus = new Set();
  return enregistrements
    .map((e) => ({ ...e, score: ressemblance(`${e.titre} ${e.album ?? ""}`, recherche) }))
    .filter((e) => e.score >= 0.6)
    .sort((a, b) => b.score - a.score)
    .filter((e) => (vus.has(e.url) ? false : vus.add(e.url)))
    .slice(0, nombre)
    .map(({ score, mime, libre, ...e }) => e);
};

export const creerChants = ({ catalogue, dossier, fetchImpl = fetch }) => {
  const fiches = new Map(catalogue.chants.map((fiche) => [fiche.id, fiche]));
  const enCours = new Map();
  mkdirSync(dossier, { recursive: true });

  const trouver = async (fiche) => {
    const recherches = [fiche.recherche ?? fiche.titre, ...(fiche.autresRecherches ?? [])];
    const trouves = [];
    for (const recherche of recherches) {
      const [commons, archive] = await Promise.allSettled([
        chercherCommons(recherche, fetchImpl),
        chercherArchive(`title:(${recherche})`, fetchImpl, 4),
      ]);
      if (commons.status === "fulfilled") trouves.push(...choisir(commons.value, recherche));
      if (archive.status === "fulfilled") trouves.push(...choisir(archive.value, recherche));
      if (trouves.length >= 3) break;
    }
    const vus = new Set();
    return trouves.filter((e) => (vus.has(e.url) ? false : vus.add(e.url))).slice(0, 4);
  };

  const charger = (id) => {
    if (enCours.has(id)) return enCours.get(id);
    const promesse = (async () => {
      const fichier = join(dossier, `${id}.json`);
      if (existsSync(fichier)) {
        const garde = JSON.parse(await readFile(fichier, "utf8"));
        // Rien trouvé la dernière fois : on retente au bout d'une semaine.
        if (garde.enregistrements.length || Date.now() - Date.parse(garde.cherchéLe) < UNE_SEMAINE)
          return garde;
      }
      const chant = {
        id,
        enregistrements: await trouver(fiches.get(id)),
        cherchéLe: new Date().toISOString(),
      };
      await writeFile(fichier, JSON.stringify(chant));
      return chant;
    })();
    enCours.set(id, promesse);
    promesse.finally(() => enCours.delete(id));
    return promesse;
  };

  let decouvertes = null;
  const decouvrir = async () => {
    const fichier = join(dossier, "_decouvrir.json");
    if (decouvertes && Date.now() - Date.parse(decouvertes.cherchéLe) < UNE_SEMAINE)
      return decouvertes;
    if (existsSync(fichier)) {
      decouvertes = JSON.parse(await readFile(fichier, "utf8"));
      if (Date.now() - Date.parse(decouvertes.cherchéLe) < UNE_SEMAINE) return decouvertes;
    }
    const [archive, commons, cantiques] = await Promise.allSettled([
      chercherArchive("subject:(hymns OR hymn OR gospel)", fetchImpl, 8),
      chercherCommons("hymn", fetchImpl, 40),
      chercherCommons("cantique", fetchImpl, 30),
    ]);
    const tous = [
      ...(cantiques.status === "fulfilled" ? cantiques.value : []),
      ...(commons.status === "fulfilled" ? commons.value : []),
      ...(archive.status === "fulfilled" ? archive.value : []),
    ].map(({ mime, libre, ...e }) => e);
    const vus = new Set();
    decouvertes = {
      enregistrements: tous.filter((e) => (vus.has(e.url) ? false : vus.add(e.url))).slice(0, 60),
      cherchéLe: new Date().toISOString(),
    };
    await writeFile(fichier, JSON.stringify(decouvertes));
    return decouvertes;
  };

  const repondre = (res, statut, corps, cache = statut === 200) => {
    res.writeHead(statut, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cache ? "public, max-age=3600" : "no-store",
    });
    res.end(JSON.stringify(corps));
  };

  const gerer = async (req, res) => {
    const chemin = (req.url ?? "").split("?")[0];
    try {
      if (chemin === "/chants/api/decouvrir") {
        const { enregistrements } = await decouvrir();
        return repondre(res, 200, { enregistrements });
      }
      const [, id] = chemin.match(/^\/chants\/api\/chant\/([a-z0-9-]+)$/) ?? [];
      if (!id || !fiches.has(id)) return repondre(res, 404, { erreur: "chant inconnu" });
      const chant = await charger(id);
      return repondre(res, 200, { id, enregistrements: chant.enregistrements });
    } catch (erreur) {
      return repondre(res, 502, { erreur: erreur.message });
    }
  };

  /** Cherche les enregistrements de tous les chants, un par un, puis les découvertes. */
  gerer.prechauffer = async () => {
    let trouves = 0;
    for (const id of fiches.keys()) {
      try {
        if ((await charger(id)).enregistrements.length) trouves += 1;
      } catch (erreur) {
        console.log(`Chant « ${id} » : ${erreur.message}`);
      }
    }
    try {
      const { enregistrements } = await decouvrir();
      console.log(`Chants prêts : ${trouves}/${fiches.size} avec enregistrement, ${enregistrements.length} découvertes.`);
    } catch (erreur) {
      console.log(`Chants prêts : ${trouves}/${fiches.size} ; découvertes indisponibles (${erreur.message}).`);
    }
  };

  return gerer;
};
