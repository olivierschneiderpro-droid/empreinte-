// Empreinte · Livres chrétiens du domaine public.
// Le texte vient du Projet Gutenberg (trouvé par Gutendex), la voix de LibriVox. Le serveur
// cherche le livre une fois, le découpe en chapitres et garde le résultat dans un dossier de
// cache (~/empreinte-livres) : l'app ne parle qu'à ce serveur.
//
//   GET /livres/api/livre/<id>        → { titre, chapitres: [{ titre }], audio, source }
//   GET /livres/api/livre/<id>/<n>    → { titre, paragraphes }
import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const GUTENDEX = "https://gutendex.com/books";
const LIBRIVOX = "https://librivox.org/api/feed/audiobooks";
const AGENT = {
  "User-Agent": "Empreinte (lecteur de livres du domaine public)",
};

const ENTITES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  laquo: "«",
  raquo: "»",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  eacute: "é",
  egrave: "è",
  ecirc: "ê",
  agrave: "à",
  acirc: "â",
  ccedil: "ç",
  ocirc: "ô",
  ucirc: "û",
  ugrave: "ù",
  icirc: "î",
  iuml: "ï",
  euml: "ë",
  oelig: "œ",
  aelig: "æ",
  Eacute: "É",
  Egrave: "È",
  Agrave: "À",
  Ccedil: "Ç",
  OElig: "Œ",
};

export const texteSeul = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (tout, nom) => ENTITES[nom] ?? tout)
    .replace(/\s+/g, " ")
    .trim();

const paragraphesDe = (html) =>
  html
    .replace(/<span[^>]*class="[^"]*pagenum[^"]*"[^>]*>.*?<\/span>/gis, " ")
    .split(/<\/p>|<br\s*\/?>|<\/div>|<\/blockquote>|<\/li>|<hr[^>]*>/i)
    .map(texteSeul)
    .filter(
      (texte) => texte && !/^\[?\s*(page|p\.)?\s*\d+\s*\]?$/i.test(texte),
    );

const SANS_INTERET =
  /^(contents|table|table des mati[eè]res|index|footnotes|transcriber)/i;

/**
 * Découpe le HTML d'un livre Gutenberg en chapitres. Les titres h2 et h3 ouvrent un
 * chapitre ; un titre suivi d'aucun texte (« Livre premier » avant « Chapitre I ») est
 * accolé au suivant. Sans titres, le livre est coupé en parties d'égale longueur.
 */
export const decouperGutenberg = (html) => {
  const debut = html.search(/\*\*\*\s*START OF[^*]*\*\*\*/i);
  const fin = html.search(/\*\*\*\s*END OF/i);
  let corps = html.slice(
    debut >= 0 ? html.indexOf("***", debut + 3) + 3 : 0,
    fin >= 0 ? fin : undefined,
  );
  corps = corps.replace(/<(style|script|head)[^>]*>.*?<\/\1>/gis, " ");

  const morceaux = corps.split(/(<h[23][^>]*>.*?<\/h[23]>)/is);
  const chapitres = [];
  let enAttente = "";
  const avant = paragraphesDe(morceaux[0] ?? "");
  if (avant.join(" ").length > 400)
    chapitres.push({ titre: "", paragraphes: avant });
  for (let i = 1; i < morceaux.length; i += 2) {
    const titre = texteSeul(morceaux[i]);
    const paragraphes = paragraphesDe(morceaux[i + 1] ?? "");
    if (SANS_INTERET.test(titre)) continue;
    const complet = [enAttente, titre].filter(Boolean).join(" — ");
    if (!paragraphes.length || paragraphes.join(" ").length < 120) {
      enAttente = complet;
      continue;
    }
    enAttente = "";
    chapitres.push({ titre: complet, paragraphes });
  }
  if (chapitres.length >= 2) return chapitres;

  const tous = paragraphesDe(corps);
  const taille = 30;
  return Array.from({ length: Math.ceil(tous.length / taille) }, (_, i) => ({
    titre: "",
    paragraphes: tous.slice(i * taille, (i + 1) * taille),
  }));
};

const normaliser = (texte) =>
  (texte ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const json = async (url, fetchImpl, ms = 25000) => {
  const reponse = await fetchImpl(url, {
    headers: AGENT,
    signal: AbortSignal.timeout(ms),
  });
  if (!reponse.ok) throw new Error(`${new URL(url).host} : ${reponse.status}`);
  return reponse.json();
};

const avecHtml = (livre) =>
  Object.keys(livre.formats ?? {}).some((type) => type.startsWith("text/html"));

/**
 * Secours quand Gutendex ne répond pas : la recherche officielle de Gutenberg (OPDS).
 * On garde le premier résultat ; la recherche porte sur le titre et l'auteur.
 */
const chercherOpds = async (fiche, fetchImpl) => {
  const reponse = await fetchImpl(
    `https://www.gutenberg.org/ebooks/search.opds/?query=${encodeURIComponent(fiche.recherche)}`,
    { headers: AGENT, signal: AbortSignal.timeout(25000) },
  );
  if (!reponse.ok) return undefined;
  const xml = await reponse.text();
  const entree = xml
    .split("<entry>")
    .slice(1)
    .find((bloc) => /\/ebooks\/\d+</.test(bloc));
  if (!entree) return undefined;
  const id = Number(entree.match(/\/ebooks\/(\d+)</)[1]);
  const titre = texteSeul(
    entree.match(/<title[^>]*>(.*?)<\/title>/s)?.[1] ?? "",
  );
  return {
    id,
    title: titre,
    authors: [],
    formats: {
      "text/html": `https://www.gutenberg.org/ebooks/${id}.html.images`,
    },
  };
};

/** Le livre Gutenberg qui correspond à la fiche : bonne langue, bon auteur, en HTML. */
const trouverGutenberg = async (fiche, fetchImpl) => {
  try {
    if (fiche.gutenberg)
      return await json(`${GUTENDEX}/${fiche.gutenberg}`, fetchImpl);
    const { results = [] } = await json(
      `${GUTENDEX}?languages=${fiche.langue}&search=${encodeURIComponent(fiche.recherche)}`,
      fetchImpl,
    );
    const auteur = normaliser(fiche.auteurCle);
    const trouve = results.find(
      (livre) =>
        livre.authors?.some((a) => normaliser(a.name).includes(auteur)) &&
        avecHtml(livre),
    );
    if (trouve) return trouve;
  } catch {
    // Gutendex lent ou hors service : on passe par la recherche de Gutenberg.
  }
  return chercherOpds(fiche, fetchImpl);
};

/** La version LibriVox (même langue), chapitre par chapitre. Facultative. */
const trouverLibrivox = async (fiche, fetchImpl) => {
  if (!fiche.librivox) return [];
  try {
    const { books = [] } = await json(
      `${LIBRIVOX}/?format=json&extended=1&title=${encodeURIComponent(`^${fiche.librivox}`)}`,
      fetchImpl,
      60000,
    );
    const langue = { fr: "french", en: "english" }[fiche.langue];
    const livre = books.find(
      (b) => normaliser(b.language) === langue && b.sections?.length,
    );
    return (livre?.sections ?? [])
      .filter((section) => section.listen_url)
      .map((section) => ({
        titre: section.title,
        url: section.listen_url,
        duree: Number(section.playtime) || 0,
        lecteur: section.readers?.map((r) => r.display_name).join(", ") ?? "",
        page: livre.url_librivox,
      }));
  } catch {
    return [];
  }
};

export const creerLivres = ({ catalogue, dossier, fetchImpl = fetch }) => {
  const fiches = new Map(catalogue.livres.map((fiche) => [fiche.id, fiche]));
  const enCours = new Map();
  const audioEnCours = new Set();
  mkdirSync(dossier, { recursive: true });

  // La voix (LibriVox, souvent lent) se cherche à part : le texte n'attend pas.
  const chercherAudio = (livre) => {
    if (livre.audioCherche || audioEnCours.has(livre.id)) return;
    audioEnCours.add(livre.id);
    void trouverLibrivox(fiches.get(livre.id), fetchImpl)
      .then(async (audio) => {
        livre.audio = audio;
        livre.audioCherche = true;
        await writeFile(
          join(dossier, `${livre.id}.json`),
          JSON.stringify(livre),
        );
      })
      .catch(() => {})
      .finally(() => audioEnCours.delete(livre.id));
  };

  const charger = (id) => {
    if (enCours.has(id)) return enCours.get(id);
    const promesse = (async () => {
      const fichier = join(dossier, `${id}.json`);
      let livre;
      if (existsSync(fichier))
        livre = JSON.parse(await readFile(fichier, "utf8"));
      else {
        const gutenberg = await trouverGutenberg(fiches.get(id), fetchImpl);
        if (!gutenberg)
          throw new Error("livre introuvable sur le Projet Gutenberg");
        const adresse = Object.entries(gutenberg.formats).find(([type]) =>
          type.startsWith("text/html"),
        )[1];
        const page = await fetchImpl(adresse, {
          headers: AGENT,
          signal: AbortSignal.timeout(60000),
        });
        if (!page.ok) throw new Error(`gutenberg.org : ${page.status}`);
        livre = {
          id,
          chapitres: decouperGutenberg(await page.text()),
          audio: [],
          audioCherche: false,
          source: {
            gutenberg: gutenberg.id,
            url: `https://www.gutenberg.org/ebooks/${gutenberg.id}`,
            titre: gutenberg.title,
            auteurs: gutenberg.authors?.map((a) => a.name) ?? [],
          },
          recupereLe: new Date().toISOString(),
        };
        await writeFile(fichier, JSON.stringify(livre));
      }
      // Anciennes entrées du cache : l'audio y était déjà cherché.
      if (livre.audioCherche === undefined) livre.audioCherche = true;
      chercherAudio(livre);
      return livre;
    })();
    enCours.set(id, promesse);
    promesse.catch(() => enCours.delete(id));
    return promesse;
  };

  const repondre = (res, statut, corps, cache = statut === 200) => {
    res.writeHead(statut, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cache ? "public, max-age=3600" : "no-store",
    });
    res.end(JSON.stringify(corps));
  };

  const gerer = async (req, res) => {
    const [, id, numero] =
      (req.url ?? "")
        .split("?")[0]
        .match(/^\/livres\/api\/livre\/([a-z0-9-]+)(?:\/(\d+))?$/) ?? [];
    if (!id || !fiches.has(id))
      return repondre(res, 404, { erreur: "livre inconnu" });
    try {
      const livre = await charger(id);
      if (numero === undefined)
        return repondre(
          res,
          200,
          {
            id,
            chapitres: livre.chapitres.map((c) => ({ titre: c.titre })),
            audio: livre.audio,
            audioEnCours: !livre.audioCherche,
            source: livre.source,
          },
          livre.audioCherche,
        );
      const chapitre = livre.chapitres[Number(numero)];
      if (!chapitre) return repondre(res, 404, { erreur: "chapitre inconnu" });
      return repondre(res, 200, chapitre);
    } catch (erreur) {
      return repondre(res, 502, { erreur: erreur.message });
    }
  };

  /** Prépare tous les livres du catalogue, un par un : ensuite chaque ouverture est immédiate. */
  gerer.prechauffer = async () => {
    for (const id of fiches.keys()) {
      try {
        await charger(id);
      } catch (erreur) {
        console.log(
          `Livre « ${id} » pas encore disponible : ${erreur.message}`,
        );
      }
    }
    console.log("Livres prêts.");
  };

  return gerer;
};
