/**
 * Minimal BM25 ranking implementation — no external search engine or API.
 *
 * BM25 scores a document D for a query Q as:
 *   score(D,Q) = Σ_term IDF(term) * (f * (k1+1)) / (f + k1 * (1 - b + b * |D|/avgdl))
 * where f is the term frequency in D, |D| the doc length, avgdl the average
 * doc length, and IDF a smoothed inverse document frequency.
 *
 * Vendored verbatim from @chatbot/core.
 */
import type { SerializedBm25 } from "./types";
import { tokenize } from "./tokenizer";

export interface Bm25Doc {
  id: string;
  text: string;
}

const DEFAULT_K1 = 1.5;
const DEFAULT_B = 0.75;

export class Bm25Index {
  private constructor(private readonly data: SerializedBm25) {}

  /** Build an index from documents. */
  static build(
    docs: Bm25Doc[],
    opts: { k1?: number; b?: number } = {}
  ): Bm25Index {
    const k1 = opts.k1 ?? DEFAULT_K1;
    const b = opts.b ?? DEFAULT_B;
    const docLen: Record<string, number> = {};
    const df: Record<string, number> = {};
    const postings: Record<string, Record<string, number>> = {};
    let totalLen = 0;

    for (const doc of docs) {
      const terms = tokenize(doc.text);
      docLen[doc.id] = terms.length;
      totalLen += terms.length;

      const seen = new Set<string>();
      for (const term of terms) {
        (postings[term] ??= {})[doc.id] = (postings[term]?.[doc.id] ?? 0) + 1;
        if (!seen.has(term)) {
          df[term] = (df[term] ?? 0) + 1;
          seen.add(term);
        }
      }
    }

    const n = docs.length;
    return new Bm25Index({
      n,
      avgdl: n > 0 ? totalLen / n : 0,
      docLen,
      df,
      postings,
      k1,
      b,
    });
  }

  static from(data: SerializedBm25): Bm25Index {
    return new Bm25Index(data);
  }

  serialize(): SerializedBm25 {
    return this.data;
  }

  /** Return the top-k doc ids with BM25 scores for a query string. */
  search(query: string, k = 8): Array<{ id: string; score: number }> {
    const { n, avgdl, docLen, df, postings, k1, b } = this.data;
    if (n === 0) return [];

    const qTerms = tokenize(query);
    const scores = new Map<string, number>();

    for (const term of qTerms) {
      const post = postings[term];
      if (!post) continue;
      const termDf = df[term] ?? 0;
      // Smoothed IDF (BM25+ style, always non-negative).
      const idf = Math.log(1 + (n - termDf + 0.5) / (termDf + 0.5));

      for (const docId of Object.keys(post)) {
        const f = post[docId] ?? 0;
        const dl = docLen[docId] ?? 0;
        const denom = f + k1 * (1 - b + (b * dl) / (avgdl || 1));
        const contribution = idf * ((f * (k1 + 1)) / (denom || 1));
        scores.set(docId, (scores.get(docId) ?? 0) + contribution);
      }
    }

    return [...scores.entries()]
      .map(([id, score]) => ({ id, score }))
      .sort((a, b2) => b2.score - a.score)
      .slice(0, k);
  }
}
