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

const json = async (url, fetchImpl) => {
  const reponse = await fetchImpl(url, { headers: AGENT });
  if (!reponse.ok) throw new Error(`${new URL(url).host} : ${reponse.status}`);
  return reponse.json();
};

/** Le livre Gutenberg qui correspond à la fiche : bonne langue, bon auteur, en HTML. */
const trouverGutenberg = async (fiche, fetchImpl) => {
  if (fiche.gutenberg) return json(`${GUTENDEX}/${fiche.gutenberg}`, fetchImpl);
  const { results = [] } = await json(
    `${GUTENDEX}?languages=${fiche.langue}&search=${encodeURIComponent(fiche.recherche)}`,
    fetchImpl,
  );
  const auteur = normaliser(fiche.auteurCle);
  return results.find(
    (livre) =>
      livre.authors?.some((a) => normaliser(a.name).includes(auteur)) &&
      Object.keys(livre.formats ?? {}).some((type) =>
        type.startsWith("text/html"),
      ),
  );
};

/** La version LibriVox (même langue), chapitre par chapitre. Facultative. */
const trouverLibrivox = async (fiche, fetchImpl) => {
  if (!fiche.librivox) return [];
  try {
    const { books = [] } = await json(
      `${LIBRIVOX}/?format=json&extended=1&title=${encodeURIComponent(`^${fiche.librivox}`)}`,
      fetchImpl,
    );
    const langue = { fr: "french", en: "english" }[fiche.langue];
    const livre =
      books.find(
        (b) => normaliser(b.language) === langue && b.sections?.length,
      ) ?? undefined;
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
  mkdirSync(dossier, { recursive: true });

  const charger = (id) => {
    if (enCours.has(id)) return enCours.get(id);
    const promesse = (async () => {
      const fichier = join(dossier, `${id}.json`);
      if (existsSync(fichier))
        return JSON.parse(await readFile(fichier, "utf8"));
      const fiche = fiches.get(id);
      const gutenberg = await trouverGutenberg(fiche, fetchImpl);
      if (!gutenberg)
        throw new Error("livre introuvable sur le Projet Gutenberg");
      const adresse = Object.entries(gutenberg.formats).find(([type]) =>
        type.startsWith("text/html"),
      )[1];
      const page = await fetchImpl(adresse, { headers: AGENT });
      if (!page.ok) throw new Error(`gutenberg.org : ${page.status}`);
      const livre = {
        id,
        chapitres: decouperGutenberg(await page.text()),
        audio: await trouverLibrivox(fiche, fetchImpl),
        source: {
          gutenberg: gutenberg.id,
          url: `https://www.gutenberg.org/ebooks/${gutenberg.id}`,
          titre: gutenberg.title,
          auteurs: gutenberg.authors?.map((a) => a.name) ?? [],
        },
        recupereLe: new Date().toISOString(),
      };
      await writeFile(fichier, JSON.stringify(livre));
      return livre;
    })();
    enCours.set(id, promesse);
    promesse.catch(() => enCours.delete(id));
    return promesse;
  };

  const repondre = (res, statut, corps) => {
    res.writeHead(statut, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": statut === 200 ? "public, max-age=3600" : "no-store",
    });
    res.end(JSON.stringify(corps));
  };

  return async (req, res) => {
    const [, id, numero] =
      (req.url ?? "")
        .split("?")[0]
        .match(/^\/livres\/api\/livre\/([a-z0-9-]+)(?:\/(\d+))?$/) ?? [];
    if (!id || !fiches.has(id))
      return repondre(res, 404, { erreur: "livre inconnu" });
    try {
      const livre = await charger(id);
      if (numero === undefined)
        return repondre(res, 200, {
          id,
          chapitres: livre.chapitres.map((c) => ({ titre: c.titre })),
          audio: livre.audio,
          source: livre.source,
        });
      const chapitre = livre.chapitres[Number(numero)];
      if (!chapitre) return repondre(res, 404, { erreur: "chapitre inconnu" });
      return repondre(res, 200, chapitre);
    } catch (erreur) {
      return repondre(res, 502, { erreur: erreur.message });
    }
  };
};
