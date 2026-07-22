/**
 * Lightweight, dependency-free tokenizer used by both indexing and querying.
 * Deterministic and self-contained — no external NLP service (per the no-API design).
 * Vendored verbatim from @chatbot/core.
 */

/** Common English stopwords removed before indexing/scoring. */
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "so", "of", "to", "in",
  "on", "for", "with", "at", "by", "from", "up", "about", "into", "over",
  "after", "is", "are", "was", "were", "be", "been", "being", "am", "do",
  "does", "did", "have", "has", "had", "i", "you", "he", "she", "it", "we",
  "they", "me", "my", "your", "this", "that", "these", "those", "as", "can",
  "will", "just", "not", "no", "yes",
]);

/** Very light stemmer: lowercases and strips a few common English suffixes. */
export function stem(token: string): string {
  let t = token;
  if (t.length > 4 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith("ies")) t = t.slice(0, -3) + "y";
  else if (t.length > 3 && t.endsWith("es")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s")) t = t.slice(0, -1);
  return t;
}

/**
 * Tokenize text into normalized terms.
 * @param opts.keepStopwords when true, stopwords are retained (useful for phrase intents).
 */
export function tokenize(
  text: string,
  opts: { keepStopwords?: boolean } = {}
): string[] {
  const raw = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  const out: string[] = [];
  for (const w of raw) {
    if (!opts.keepStopwords && STOPWORDS.has(w)) continue;
    if (w.length === 1 && !/[0-9]/.test(w)) continue;
    out.push(stem(w));
  }
  return out;
}
