/**
 * The orchestrator: one function that maps a ChatRequest against a SiteIndex to
 * a ChatResponse. Vendored verbatim from @chatbot/core — this is the public
 * entry point the chat API route calls per message.
 */
import type { ChatRequest, ChatResponse, SiteIndex } from "./types";
import { retrieve } from "./retrieve";
import { classifyIntent } from "./intents";
import { respond } from "./respond";

export function answer(index: SiteIndex, req: ChatRequest): ChatResponse {
  const message = (req.message ?? "").trim();

  if (!message) {
    return respond({
      intent: "greeting",
      hits: [],
      config: index.config,
      message,
    });
  }

  const hits = retrieve(index, message, { page: req.page, k: 6 });
  const intent = classifyIntent(message, hits.length > 0);
  return respond({ intent, hits, config: index.config, message });
}
