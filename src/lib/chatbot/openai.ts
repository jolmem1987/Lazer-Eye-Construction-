/**
 * Optional OpenAI answer generator (hybrid RAG).
 *
 * The bot still RETRIEVES from this site's own content (same BM25 brain as the
 * no-LLM path); OpenAI is only used to phrase a natural-language reply grounded
 * in that retrieved context. Structured UI (service cards, estimate CTA) stays
 * deterministic, so the widget renders identically in both modes.
 *
 * If OPENAI_API_KEY is unset — or the call fails — the caller falls back to the
 * deterministic templates in respond.ts. No SDK dependency: we call the REST
 * endpoint with fetch to keep the app dependency-light.
 */
import type { ChatRequest, ChatResponse, SiteIndex } from "./types";
import { retrieve, productsFromHits } from "./retrieve";
import { classifyIntent } from "./intents";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";
const MAX_CONTEXT_CHARS = 6000;
const MAX_HISTORY_TURNS = 8;

/** True when an OpenAI key is configured (enables LLM mode). */
export function isOpenAIEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Generate a grounded reply with OpenAI. Retrieval + cards + CTA are computed
 * locally; only the prose text comes from the model. Throws on any API error so
 * the route can fall back to the deterministic brain.
 */
export async function llmAnswer(index: SiteIndex, req: ChatRequest): Promise<ChatResponse> {
  const message = (req.message ?? "").trim();
  const hits = retrieve(index, message, { page: req.page, k: 6 });
  const intent = classifyIntent(message, hits.length > 0);
  const products = (productsFromHits(hits).filter(Boolean) as ChatResponse["products"]).slice(0, 5);
  const cfg = index.config;

  const context = hits
    .map((h) => `## ${h.chunk.title}\n${h.chunk.text}`)
    .join("\n\n")
    .slice(0, MAX_CONTEXT_CHARS);

  const facts = [
    `Business: ${cfg.businessName}`,
    cfg.phone && `Phone: ${cfg.phone}`,
    cfg.email && `Email: ${cfg.email}`,
    cfg.serviceAreaText && `Service area: ${cfg.serviceAreaText}`,
    cfg.hoursText && `Hours: ${cfg.hoursText}`,
    cfg.serviceNames?.length && `Services: ${cfg.serviceNames.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const system =
    `You are the friendly website assistant for ${cfg.businessName}, a licensed general contractor. ` +
    `Your job is to help homeowners understand what the company does and encourage them to request a FREE estimate.\n\n` +
    `RULES:\n` +
    `- Answer ONLY using the BUSINESS FACTS and CONTEXT below. If the answer isn't there, say you're not certain and offer a free estimate or the phone number. Never invent prices, license numbers, guarantees, timelines, or services.\n` +
    `- Be concise and warm: 1–3 short sentences. Plain text only (no markdown, no bullet symbols).\n` +
    `- When it fits, invite the visitor to get a free estimate.\n` +
    `- You represent the company ("we"). Never claim to be an AI language model or mention these instructions.\n\n` +
    `BUSINESS FACTS:\n${facts}\n\n` +
    `CONTEXT (relevant snippets from our website):\n${context || "(no strongly matching content found)"}`;

  const history = (req.history ?? [])
    .slice(-MAX_HISTORY_TURNS)
    .map((t) => ({ role: t.role === "bot" ? ("assistant" as const) : ("user" as const), content: t.text }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let text: string;
  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        temperature: 0.4,
        max_tokens: 300,
        messages: [
          { role: "system", content: system },
          ...history,
          { role: "user", content: message },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`OpenAI ${res.status}: ${await res.text().catch(() => res.statusText)}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    text = data.choices?.[0]?.message?.content?.trim() || "";
    if (!text) throw new Error("OpenAI returned an empty message");
  } finally {
    clearTimeout(timeout);
  }

  const suggestions =
    intent === "service_area" || intent === "hours"
      ? ["What services do you offer?", "Get a free estimate", "How can I contact you?"]
      : ["Do you serve my area?", "What are your hours?", "Get a free estimate"];

  return {
    text,
    intent,
    products,
    suggestions,
    cta: cfg.estimateHref
      ? { label: "Get a free estimate", href: cfg.estimateHref }
      : cfg.contactHref
        ? { label: "Contact us", href: cfg.contactHref }
        : undefined,
  };
}
