/**
 * Domain types for the in-app retrieval chatbot.
 *
 * Vendored from the "@chatbot/core" package (D:\Software\Chat Bot) and adapted
 * for a single-tenant home-services / general-contractor site: the retrieval
 * engine (tokenizer, BM25, retrieve, agent) is unchanged; the intent set and
 * SiteConfig carry contractor context instead of e-commerce fields.
 *
 * The bot answers entirely from this site's own content (see knowledge.ts) with
 * NO LLM and NO external API — every reply is composed from indexed site text.
 */

/**
 * A structured item surfaced as a card in the widget. On this site each one is
 * a *service* (deck, windows, roofing…) rather than a purchasable product, so
 * price/availability are optional and usually unset.
 */
export interface Product {
  /** Stable id, e.g. "svc_s1". */
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  priceText?: string;
  image?: string;
  url: string;
  availability?: string;
  attributes?: Record<string, string>;
}

/** A searchable unit of content. Each service, FAQ, or page section is a chunk. */
export interface Chunk {
  id: string;
  siteId: string;
  url: string;
  title: string;
  /** Plain text used for retrieval. */
  text: string;
  kind: "page" | "product";
  /** Present when kind === "product". */
  productId?: string;
}

/** Serializable BM25 index over a site's chunks. */
export interface SerializedBm25 {
  n: number;
  avgdl: number;
  docLen: Record<string, number>;
  df: Record<string, number>;
  postings: Record<string, Record<string, number>>;
  k1: number;
  b: number;
}

/** The full in-memory state used to answer a message. */
export interface SiteIndex {
  siteId: string;
  origin: string;
  builtAt: string;
  bm25: SerializedBm25;
  chunks: Record<string, Chunk>;
  products: Record<string, Product>;
  config: SiteConfig;
}

/** Per-site assistant configuration (persona, greeting, contractor context). */
export interface SiteConfig {
  siteId: string;
  /** Display name of the business, e.g. "Lazer Eye Construction". */
  businessName: string;
  /** First line the bot says when the panel opens. */
  greeting: string;
  /** Where to send a human handoff, e.g. "tel:+17705550147". */
  contactHref?: string;
  tone?: "friendly" | "professional" | "playful";

  /* --- contractor context (used by the response templates) --- */
  /** Link to the on-site estimate form, e.g. "/#estimate". */
  estimateHref?: string;
  phone?: string;
  email?: string;
  /** One-line summary of the cities/counties served. */
  serviceAreaText?: string;
  /** Compact business-hours summary, e.g. "Mon–Fri 7am–5pm · Sat 8am–12pm". */
  hoursText?: string;
  /** Names of the active services, for listing when nothing specific matched. */
  serviceNames?: string[];
}

/** Live context the widget sends about the page the visitor is on. */
export interface PageContext {
  url?: string;
  title?: string;
  text?: string;
  product?: Partial<Product>;
}

/** A single retrieval hit. */
export interface RetrievalHit {
  chunk: Chunk;
  score: number;
  product?: Product;
}

/** A chat turn from the visitor. */
export interface ChatRequest {
  siteId: string;
  message: string;
  page?: PageContext;
  history?: ChatTurn[];
}

export interface ChatTurn {
  role: "user" | "bot";
  text: string;
}

/** What the bot sends back: text plus optional structured UI payloads. */
export interface ChatResponse {
  text: string;
  intent: Intent;
  /** Service cards to render in the widget. */
  products: Product[];
  /** Suggested quick-reply chips. */
  suggestions: string[];
  /** Optional call-to-action link. */
  cta?: { label: string; href: string };
}

/** Home-services intent set (replaces the source's e-commerce intents). */
export type Intent =
  | "greeting"
  | "services"
  | "estimate"
  | "service_area"
  | "hours"
  | "contact"
  | "smalltalk"
  | "fallback";
