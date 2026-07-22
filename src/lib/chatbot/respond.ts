/**
 * Turn an intent + retrieval results into a templated reply.
 * Every response is composed from this site's own content (service names,
 * descriptions, service-area, hours, page snippets) — the "no LLM" brain.
 * Phrasing is fully deterministic given the same inputs.
 *
 * Adapted from @chatbot/core for a general-contractor / home-services site.
 */
import type { ChatResponse, Intent, Product, RetrievalHit, SiteConfig } from "./types";
import { productsFromHits } from "./retrieve";

export interface RespondInput {
  intent: Intent;
  hits: RetrievalHit[];
  config: SiteConfig;
  message: string;
}

export function respond(input: RespondInput): ChatResponse {
  const { intent, hits, config } = input;
  const services = productsFromHits(hits).filter(Boolean) as Product[];
  const topSnippet = hits.find((h) => h.chunk.kind === "page")?.chunk.text;

  const estimateCta = config.estimateHref
    ? { label: "Get a free estimate", href: config.estimateHref }
    : config.contactHref
      ? { label: "Contact us", href: config.contactHref }
      : undefined;
  const callCta = config.contactHref
    ? { label: config.phone ? `Call ${config.phone}` : "Call us", href: config.contactHref }
    : undefined;

  const baseSuggestions = [
    "What services do you offer?",
    "Do you serve my area?",
    "Get a free estimate",
  ];

  switch (intent) {
    case "greeting":
      return build({
        text: config.greeting,
        products: services.slice(0, 3),
        suggestions: baseSuggestions,
        intent,
        cta: estimateCta,
      });

    case "services": {
      if (services.length) {
        return build({
          text: `Here's what fits what you're describing — ${config.businessName} handles all of it in-house:`,
          products: services.slice(0, 5),
          suggestions: [
            ...services.slice(0, 2).map((s) => `Tell me about ${s.name.toLowerCase()}`),
            "Get a free estimate",
          ],
          intent,
          cta: estimateCta,
        });
      }
      const list = (config.serviceNames ?? []).slice(0, 8);
      const listText = list.length ? `\n\n${list.map((n) => `• ${n}`).join("\n")}` : "";
      return build({
        text: `We're a full-service general contractor — decks and pergolas, doors and windows, roofing, siding, and interior remodels.${listText}\n\nWhat project did you have in mind?`,
        products: [],
        suggestions: baseSuggestions,
        intent,
        cta: estimateCta,
      });
    }

    case "estimate":
      return build({
        text:
          `Estimates are free and written — no pressure. We'll look at your project in person, walk you ` +
          `through the options, and give you an itemized quote.` +
          (config.phone ? ` You can also call us at ${config.phone}.` : ""),
        products: services.slice(0, 3),
        suggestions: ["What services do you offer?", "Do you serve my area?", "What are your hours?"],
        intent,
        cta: estimateCta,
      });

    case "service_area":
      return build({
        text: config.serviceAreaText
          ? `We're based in and around ${config.serviceAreaText} If you're nearby and not sure, just ask — we travel for the right project.`
          : `Tell me your city or ZIP and I'll let you know if you're in our service area.`,
        products: [],
        suggestions: ["What services do you offer?", "Get a free estimate", "What are your hours?"],
        intent,
        cta: estimateCta,
      });

    case "hours":
      return build({
        text: config.hoursText
          ? `Our office hours are ${config.hoursText}.` +
            (config.phone ? ` Call ${config.phone} and we'll get you on the schedule.` : " Send us a message and we'll get you on the schedule.")
          : `Reach out any time and we'll get back to you with scheduling.`,
        products: [],
        suggestions: ["Get a free estimate", "What services do you offer?", "Do you serve my area?"],
        intent,
        cta: callCta ?? estimateCta,
      });

    case "contact": {
      const bits: string[] = [];
      if (config.phone) bits.push(`📞 ${config.phone}`);
      if (config.email) bits.push(`✉️ ${config.email}`);
      const contactLines = bits.length ? `\n\n${bits.join("\n")}` : "";
      return build({
        text: `Happy to connect you with the ${config.businessName} team.${contactLines}\n\nOr request a free estimate and we'll reach out to you.`,
        products: [],
        suggestions: baseSuggestions,
        intent,
        cta: estimateCta ?? callCta,
      });
    }

    case "smalltalk":
      return build({
        text: `Glad to help! I'm the ${config.businessName} assistant — I can tell you what we build, whether we cover your area, and how to get a free estimate. What are you working on?`,
        products: [],
        suggestions: baseSuggestions,
        intent,
        cta: estimateCta,
      });

    case "fallback":
    default:
      return build({
        text: topSnippet
          ? `I want to point you the right way. Here's the closest thing I found on our site:\n\n${truncate(topSnippet, 300)}\n\nOr I can help with services, your area, hours, or a free estimate.`
          : `I can help with our services, service area, hours, and free estimates. What would you like to know?`,
        products: services.slice(0, 3),
        suggestions: baseSuggestions,
        intent: "fallback",
        cta: estimateCta,
      });
  }
}

/* ------------------------------- helpers -------------------------------- */

function build(r: {
  text: string;
  products: Product[];
  suggestions: string[];
  intent: Intent;
  cta?: { label: string; href: string };
}): ChatResponse {
  return {
    text: r.text,
    intent: r.intent,
    products: r.products,
    suggestions: r.suggestions,
    cta: r.cta,
  };
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
