/**
 * Deterministic intent classification via keyword/pattern matching.
 * No model or API — just ordered rules. Order matters: the first matching rule
 * wins, so specific intents are checked before general ones.
 *
 * Adapted from @chatbot/core for a general-contractor / home-services site.
 */
import type { Intent } from "./types";

interface Rule {
  intent: Intent;
  patterns: RegExp[];
}

const RULES: Rule[] = [
  {
    intent: "greeting",
    patterns: [/^\s*(hi|hey|hello|yo|howdy|good (morning|afternoon|evening))\b/i],
  },
  {
    intent: "estimate",
    patterns: [
      /\b(price|pricing|cost|how much|quote|estimate|bid|budget|afford|financ(e|ing)|ballpark|free estimate)\b/i,
    ],
  },
  {
    intent: "service_area",
    patterns: [
      /\b(area|areas|serve|servic(e|ing) area|do you (work|serve|come|travel)|near me|located|location|where are you|which (cities|towns)|zip|county|counties)\b/i,
    ],
  },
  {
    intent: "hours",
    patterns: [
      /\b(hour|hours|open|opening|closed|when.*(open|come|available)|schedule|appointment|availability|book)\b/i,
    ],
  },
  {
    intent: "contact",
    patterns: [
      /\b(human|person|agent|representative|rep|owner|talk to|speak to|contact|email|phone|call|reach|get in touch|support)\b/i,
    ],
  },
  {
    intent: "services",
    patterns: [
      /\b(service|services|do you (do|build|install|offer|handle)|can you|deck|porch|pergola|patio|window|windows|door|doors|roof|roofing|gutter|sid(e|ing)|kitchen|bath(room)?|remodel|renovat|addition|fence|exterior)\b/i,
    ],
  },
  {
    intent: "smalltalk",
    patterns: [/\b(thanks|thank you|thx|bye|goodbye|who are you|what can you do|are you (a )?(bot|human|real))\b/i],
  },
];

/**
 * Classify a message. `hasRetrieval` indicates whether the query matched any
 * indexed content; a generic message that still retrieved something is treated
 * as a services question rather than a fallback.
 */
export function classifyIntent(message: string, hasRetrieval: boolean): Intent {
  for (const rule of RULES) {
    if (rule.patterns.some((re) => re.test(message))) return rule.intent;
  }
  if (hasRetrieval) return "services";
  return "fallback";
}
