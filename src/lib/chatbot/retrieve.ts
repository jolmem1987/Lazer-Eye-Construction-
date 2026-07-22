/**
 * Retrieval over a SiteIndex: BM25 search + service attachment + light
 * current-page boosting (index depth plus awareness of the page the visitor is
 * actually on). Vendored verbatim from @chatbot/core.
 */
import type { PageContext, RetrievalHit, SiteIndex } from "./types";
import { Bm25Index } from "./bm25";

export interface RetrieveOptions {
  k?: number;
  page?: PageContext;
  /** Multiplier applied to hits whose url matches the current page. */
  currentPageBoost?: number;
}

export function retrieve(
  index: SiteIndex,
  query: string,
  opts: RetrieveOptions = {}
): RetrievalHit[] {
  const { k = 6, page, currentPageBoost = 1.4 } = opts;
  const bm25 = Bm25Index.from(index.bm25);
  const raw = bm25.search(query, Math.max(k * 2, 12));

  const currentUrl = page?.url ? normalize(page.url) : undefined;

  const hits: RetrievalHit[] = [];
  for (const { id, score } of raw) {
    const chunk = index.chunks[id];
    if (!chunk) continue;
    const product = chunk.productId ? index.products[chunk.productId] : undefined;
    let s = score;
    if (currentUrl && normalize(chunk.url) === currentUrl) s *= currentPageBoost;
    hits.push({ chunk, score: s, product });
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
}

/** Distinct services from a set of hits, best-scoring first. */
export function productsFromHits(hits: RetrievalHit[]): RetrievalHit["product"][] {
  const seen = new Set<string>();
  const out: NonNullable<RetrievalHit["product"]>[] = [];
  for (const h of hits) {
    if (h.product && !seen.has(h.product.id)) {
      seen.add(h.product.id);
      out.push(h.product);
    }
  }
  return out;
}

function normalize(u: string): string {
  try {
    const url = new URL(u);
    return (url.origin + url.pathname).replace(/\/+$/, "").toLowerCase();
  } catch {
    return u.replace(/\/+$/, "").toLowerCase();
  }
}
