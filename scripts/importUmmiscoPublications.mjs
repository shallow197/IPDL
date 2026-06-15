import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const JSON_URL = "https://ummisco.fr/wp-content/plugins/mes-publications/publications.json";
const OUT_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data/ummiscoExternalPublications.ts");

function normalizeId(raw) {
  const text = String(raw || "").trim();
  if (!text) return `ummisco-${Date.now()}`;
  return text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function formatAuthor(author) {
  if (!author) return "";
  if (typeof author === "string") return author.trim();
  if (typeof author === "object") {
    if (author.literal) return String(author.literal).trim();
    const family = String(author.family || "").trim();
    const given = String(author.given || "").trim();
    if (family && given) return `${family}, ${given}`;
    return family || given || "";
  }
  return String(author).trim();
}

function formatAuthors(authorField) {
  if (!authorField) return [];
  if (Array.isArray(authorField)) {
    return authorField.map(formatAuthor).filter(Boolean);
  }
  if (typeof authorField === "string") {
    return authorField
      .split(/\s*;\s*|\s+and\s+|\s*,\s*/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseYear(item) {
  const parseDateParts = (field) => {
    if (!field || !Array.isArray(field["date-parts"])) return null;
    const part = field["date-parts"][0];
    if (!Array.isArray(part) || part.length === 0) return null;
    const year = Number(part[0]);
    return Number.isFinite(year) ? year : null;
  };
  return parseDateParts(item.issued) || parseDateParts(item.accessed) || 0;
}

function extractDoi(text) {
  if (!text || typeof text !== "string") return undefined;
  const doiMatch = text.match(/10\.\d{4,9}\/[^\s"'<>]+/);
  if (doiMatch) return doiMatch[0].replace(/[)\]\s]+$/, "");
  const doiOrg = text.match(/doi\.org\/(10\.\d{4,9}\/[^\s"'<>]+)/i);
  if (doiOrg) return doiOrg[1].replace(/[)\]\s]+$/, "");
  return undefined;
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function makeCitationApa(publication) {
  const authors = publication.authors || [];
  const year = publication.year || "n.d.";
  const title = normalizeText(publication.title);
  const container = normalizeText(publication.journal || "");
  const url = publication.doi ? `https://doi.org/${publication.doi}` : publication.url || "";
  const authorText = authors.length === 0 ? "" : authors.join(", ");
  return `${authorText}${authorText ? ` (${year}). ` : ` (${year}). `}${title}${container ? `. ${container}` : ""}${url ? ` ${url}` : ""}`.trim();
}

function makeBibtex(publication, itemType) {
  const authors = publication.authors || [];
  const year = publication.year || "n.d.";
  const title = normalizeText(publication.title);
  const authorText = authors.length > 0 ? authors.join(" and ") : "";
  const journal = normalizeText(publication.journal || "");
  const url = publication.doi ? `https://doi.org/${publication.doi}` : publication.url || "";
  const type = itemType === "article-journal" ? "article" : itemType === "paper-conference" ? "inproceedings" : "misc";
  const keyBase = authors[0] ? authors[0].split(" ")[0].replace(/[^A-Za-z0-9]/g, "") : "ummisco";
  const key = `${keyBase}${year}${normalizeId(publication.title).slice(0, 20)}`;
  const fields = [
    `  title={${title}}`,
    authorText ? `  author={${authorText}}` : null,
    journal ? `  journal={${journal}}` : null,
    year ? `  year={${year}}` : null,
    publication.doi ? `  doi={${publication.doi}}` : null,
    url ? `  url={${url}}` : null,
  ].filter(Boolean);
  return `@${type}{${key},\n${fields.join(",\n")}\n}`;
}

const response = await fetch(JSON_URL);
if (!response.ok) {
  throw new Error(`Failed to fetch ${JSON_URL}: ${response.status} ${response.statusText}`);
}

const raw = await response.json();
if (!Array.isArray(raw)) {
  throw new Error(`Unexpected JSON shape: expected array, got ${typeof raw}`);
}

const publications = raw.map((item, index) => {
  const title = normalizeText(item.title || item['titulo'] || `UMMISCO publication ${index + 1}`);
  const authors = formatAuthors(item.author);
  const year = parseYear(item);
  const journal = normalizeText(item['container-title'] || item.source || "");
  const url = normalizeText(item.URL || item.url || "");
  const doi = extractDoi(url) || extractDoi(item.note) || undefined;
  const publication = {
    id: normalizeId(item.id || title || `ummisco-${index + 1}`),
    title,
    authors,
    researcherIds: [],
    year,
    axis: "agents",
    abstract: normalizeText(item.abstract || ""),
    citationApa: "",
    citationBibtex: "",
    accessLevel: "public",
    doi,
    journal: journal || undefined,
    url: url || undefined,
  };
  publication.citationApa = makeCitationApa(publication);
  publication.citationBibtex = makeBibtex(publication, item.type);
  return publication;
});

const byId = new Map();
for (const pub of publications) {
  if (!byId.has(pub.id)) {
    byId.set(pub.id, pub);
  }
}

const uniquePublications = Array.from(byId.values());

const generated = `/* eslint-disable */\n/* Generated from ${JSON_URL} on ${new Date().toISOString()} */\nimport type { Publication } from "./publicationTypes";\n\nexport const UMMISCO_EXTERNAL_PUBLICATIONS: Publication[] = ${JSON.stringify(uniquePublications, null, 2)};\n`;
await writeFile(OUT_FILE, generated, "utf8");
console.log(`Wrote ${uniquePublications.length} external publications to ${OUT_FILE}`);
