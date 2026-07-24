/**
 * Builds the chatbot's searchable index directly from THIS site's content
 * (services, FAQs, about, process, service area, hours) — no crawler needed.
 *
 * This is the "self-contained, in-app" wiring: the same retrieval brain from
 * @chatbot/core, fed by our own SiteConfig instead of a crawl of the live URL.
 * Everything runs server-side in /api/chat with no LLM and no external API.
 */
import type { SiteConfig as WebsiteConfig } from "@/lib/types";
import { telHref } from "@/lib/utils";
import { Bm25Index } from "./bm25";
import type { Chunk, Product, SiteConfig as BotConfig, SiteIndex } from "./types";

const SITE_ID = "lazer-eye";

/** Compact time like "7am", "4:30pm", "12pm" from a "HH:MM" 24h string. */
function shortTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${period}` : `${h12}:${m.toString().padStart(2, "0")}${period}`;
}

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Summarize business hours, collapsing consecutive days with identical ranges. */
function summarizeHours(hours: WebsiteConfig["hours"]): string {
  const byDay = new Map(hours.map((h) => [h.day, h]));
  const groups: string[] = [];
  let runStart: number | null = null;
  let runRange = "";

  const rangeFor = (day: number): string => {
    const h = byDay.get(day);
    if (!h || !h.open || !h.close) return "closed";
    return `${shortTime(h.open)}–${shortTime(h.close)}`;
  };

  // Iterate Mon(1)..Sat(6) then Sun(0) for a natural week order.
  const order = [1, 2, 3, 4, 5, 6, 0];
  const flush = (endDay: number) => {
    if (runStart === null) return;
    const label =
      runStart === endDay
        ? SHORT_DAYS[runStart]
        : `${SHORT_DAYS[runStart]}–${SHORT_DAYS[endDay]}`;
    if (runRange !== "closed") groups.push(`${label} ${runRange}`);
    runStart = null;
  };

  let prevDay = -1;
  for (const day of order) {
    const range = rangeFor(day);
    if (range === runRange && runStart !== null) {
      // extend current run
    } else {
      flush(prevDay);
      runStart = day;
      runRange = range;
    }
    prevDay = day;
  }
  flush(prevDay);

  return groups.join(" · ");
}

/** Compile our website content into the bot's SiteIndex. */
export function buildChatIndex(site: WebsiteConfig): SiteIndex {
  const chunks: Chunk[] = [];
  const products: Record<string, Product> = {};
  const push = (c: Omit<Chunk, "siteId">) => chunks.push({ ...c, siteId: SITE_ID });

  const b = site.business;

  // Business overview.
  push({
    id: "biz",
    url: "/",
    title: b.name,
    kind: "page",
    text: `${b.name}. ${b.tagline}. ${b.primaryService}. ${b.yearsExperience}+ years experience, founded ${b.foundedYear}. General contractor in ${b.city}, ${b.state}. ${site.hero.headline}. ${site.hero.subheadline}`,
  });

  // Services → both searchable chunks and service cards.
  for (const s of site.services.filter((s) => s.active)) {
    const id = `svc_${s.id}`;
    products[id] = { id, name: s.name, description: s.description, url: "/#estimate" };
    push({
      id: `chunk_${id}`,
      url: "/#estimate",
      title: s.name,
      kind: "product",
      productId: id,
      text: `${s.name}. ${s.description}`,
    });
  }

  // About / experience / mission / values.
  push({
    id: "about",
    url: "/about",
    title: `About ${b.name}`,
    kind: "page",
    text: `${site.about.story} ${site.about.experience} ${site.about.mission} ${site.about.values
      .map((v) => `${v.title}: ${v.description}`)
      .join(" ")} Owner ${site.about.ownerName}, ${site.about.ownerTitle}.`,
  });

  // How we work (process).
  push({
    id: "process",
    url: "/#process",
    title: "How we work",
    kind: "page",
    text: `Our process: ${site.process
      .sort((a, c) => a.order - c.order)
      .map((p) => `${p.title} — ${p.description}`)
      .join(" ")}`,
  });

  // Service area.
  const sa = site.serviceArea;
  push({
    id: "service_area",
    url: "/#service-area",
    title: "Service area",
    kind: "page",
    text: `${sa.description} We serve ${sa.primaryCity}, ${sa.nearbyCities.join(", ")} across ${sa.counties.join(", ")} in ${sa.state}.`,
  });

  // Hours.
  const hoursText = summarizeHours(site.hours);
  push({
    id: "hours",
    url: "/",
    title: "Hours",
    kind: "page",
    text: `Business hours: ${hoursText}. Free estimates and scheduling by appointment.`,
  });

  // FAQs.
  for (const f of site.faqs.filter((f) => f.active)) {
    push({
      id: `faq_${f.id}`,
      url: "/#faq",
      title: f.question,
      kind: "page",
      text: `${f.question} ${f.answer}`,
    });
  }

  const bm25 = Bm25Index.build(chunks.map((c) => ({ id: c.id, text: c.text })));
  const chunkMap: Record<string, Chunk> = {};
  for (const c of chunks) chunkMap[c.id] = c;

  const config: BotConfig = {
    siteId: SITE_ID,
    businessName: b.name,
    greeting: `Hi! 👋 I'm the ${b.name} assistant. Ask me about our services — decks, windows, roofing, remodels — your area, or get a free estimate.`,
    tone: "friendly",
    contactHref: telHref(b.phone),
    estimateHref: "/#estimate",
    phone: b.phone,
    email: b.email || undefined,
    serviceAreaText: `${sa.primaryCity}, plus ${sa.nearbyCities.join(", ")} across ${sa.counties.join(", ")}.`,
    hoursText,
    serviceNames: site.services.filter((s) => s.active).map((s) => s.name),
  };

  return {
    siteId: SITE_ID,
    origin: site.seo.siteUrl,
    builtAt: new Date().toISOString(),
    bm25: bm25.serialize(),
    chunks: chunkMap,
    products,
    config,
  };
}

/* --- lightweight module-level cache so we don't rebuild on every message --- */
let cached: { sig: string; index: SiteIndex } | null = null;

/** Build (or reuse) the index for the given site content. */
export function getChatIndex(site: WebsiteConfig): SiteIndex {
  const sig = [
    site.business.name,
    site.business.phone,
    site.services.filter((s) => s.active).length,
    site.faqs.filter((f) => f.active).length,
    site.serviceArea.nearbyCities.join(","),
  ].join("|");
  if (cached && cached.sig === sig) return cached.index;
  const index = buildChatIndex(site);
  cached = { sig, index };
  return index;
}
