import type { SiteConfig } from "./types";

/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH — Lazer Eye Construction (live site content)
 * ============================================================================
 *
 * This object seeds the database and is also used as a live fallback when no
 * database is connected (so the site builds and renders with zero credentials).
 *
 * Edit content WITHOUT touching source via the admin panel — it writes to the
 * database, which overrides these values.
 *
 * NOTE: the gallery projects use placeholder illustrations (public/demo/*.svg)
 * with example dates/locations, and no testimonials are shown yet. Replace the
 * project photos with real jobs and add genuine reviews from the admin panel.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://lazereyeconstruction.example.com";

export const defaultSiteConfig: SiteConfig = {
  isDemo: false,

  business: {
    name: "Lazer Eye Construction",
    legalName: "Lazer Eye Construction LLC",
    tagline: "One trusted contractor for every project — done right the first time.",
    phone: "(706) 669-1869",
    email: "estimates@lazereyeconstruction.example.com",
    addressLine: "1420 Birch Street",
    city: "Alpharetta",
    state: "GA",
    zip: "30009",
    showAddress: true,
    licenseInfo: "General contractor serving the greater Alpharetta, GA area",
    yearsExperience: 20,
    foundedYear: 2026,
    category: "GeneralContractor",
    primaryService: "General Contracting & Home Remodeling",
  },

  branding: {
    logoUrl: "/logo.png",
    faviconUrl: null,
    primaryColor: "#17191d", // near-black charcoal (logo lettering)
    secondaryColor: "#2a2e35", // slate (dark section band)
    accentColor: "#e11c24", // lazer red (logo accent)
    headingFont: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    bodyFont: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },

  hours: [
    { day: 1, open: "07:00", close: "17:00" },
    { day: 2, open: "07:00", close: "17:00" },
    { day: 3, open: "07:00", close: "17:00" },
    { day: 4, open: "07:00", close: "17:00" },
    { day: 5, open: "07:00", close: "16:00" },
    { day: 6, open: "08:00", close: "12:00" },
    { day: 0, open: null, close: null },
  ],

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: null,
    linkedin: null,
    x: null,
    googleBusinessProfile: null,
    googleReviewUrl: null,
  },

  serviceArea: {
    primaryCity: "Alpharetta",
    state: "GA",
    zip: "30009",
    counties: ["Fulton County", "Forsyth County", "Cherokee County"],
    nearbyCities: ["Roswell", "Milton", "Johns Creek", "Cumming", "Woodstock", "Sandy Springs"],
    description:
      "We are based in Alpharetta and serve homeowners across North Fulton and the surrounding metro " +
      "Atlanta area. Whether you're adding a deck in Milton, replacing windows in Roswell, or " +
      "remodeling a kitchen in Johns Creek, we handle the design, the permits, and the build with the " +
      "same care we'd give our own homes.",
  },

  hero: {
    headline: "Decks, Additions, Windows & More — Your All-in-One Contractor in Alpharetta, GA",
    subheadline:
      "Locally owned and owner-operated. From custom decks and pergolas to doors, windows, siding, " +
      "and roofing — plus flooring, cabinets, countertops, and full remodels, we do it all with one " +
      "accountable crew, plain-language answers, and work backed by a written warranty.",
    primaryCtaLabel: "Get a Free Estimate",
    secondaryCtaLabel: "Call Now",
    imageUrl: "/demo/hero-roof.svg",
    imageAlt: "A finished home exterior with a new deck, windows, and roofline on a clear day.",
  },

  about: {
    story:
      "Josh Olmem founded Lazer Eye Construction in 2026 after more than two decades in the trades — he " +
      "wanted to build things his own way, with the honesty and craftsmanship he'd always stood for. The " +
      "company is new, but the experience behind it isn't: Josh personally brings 20+ years of hands-on " +
      "building and remodeling to every project, from backyard decks and pergolas to windows, doors, " +
      "siding, roofing, and full remodels. We're a small, owner-operated shop, and we like it that way — " +
      "we want to be the contractor your neighbor recommends.",
    ownerName: "Josh Olmem",
    ownerTitle: "Owner & Lead Estimator",
    ownerBio:
      "Josh grew up on job sites and has spent over two decades building and remodeling homes " +
      "across metro Atlanta. He personally walks every estimate so homeowners get straight " +
      "answers from the person accountable for the work.",
    experience:
      "Over two decades of hands-on building and remodeling experience across Alpharetta and North " +
      "Fulton — decks, pergolas, doors, windows, siding, roofing, and interior renovations.",
    mission:
      "To be the one contractor a homeowner can call for any project — built correctly, explained " +
      "honestly, and backed by people who will still be here next year.",
    values: [
      {
        title: "Do it right, not twice",
        description:
          "We follow manufacturer specs and local code so every deck, window, and roofline holds up through Georgia storms and humidity.",
      },
      {
        title: "Plain-language honesty",
        description:
          "We tell you what your project actually needs — repair, replace, or build new — not what sells best.",
      },
      {
        title: "Respect the property",
        description:
          "We protect landscaping, clean up the job site daily, and leave your home better than we found it.",
      },
    ],
    safety:
      "We take job-site safety seriously — careful setup, clean work areas, and fall-protection " +
      "practices on every project to keep your home and our crew safe.",
    community:
      "We live and work in the same neighborhoods we serve. You'll see our trucks at the hardware " +
      "store, our kids at the same schools, and our name on the local little-league banner.",
  },

  trust: [
    { id: "t1", label: "One Contractor, Every Project", detail: "Decks to full remodels", isSample: false, active: true, order: 1 },
    { id: "t2", label: "Free Estimates", detail: "No-pressure, written quotes", isSample: false, active: true, order: 2 },
    { id: "t3", label: "Workmanship Warranty", detail: "Written warranty on labor", isSample: false, active: true, order: 3 },
    { id: "t4", label: "Owner-Operated", detail: "Based in Alpharetta, GA", isSample: false, active: true, order: 4 },
    { id: "t5", label: "20+ Years Experience", detail: "Serving metro Atlanta", isSample: false, active: true, order: 5 },
  ],

  services: [
    { id: "s1", name: "Decks & Porches", description: "Custom-built decks and covered porches in wood or low-maintenance composite — designed for how you actually use your backyard.", icon: "deck", active: true, order: 1 },
    { id: "s2", name: "Pergolas & Outdoor Living", description: "Pergolas, arbors, and outdoor structures that add shade, style, and usable living space to your yard.", icon: "leaf", active: true, order: 2 },
    { id: "s3", name: "Doors & Windows", description: "Energy-efficient replacement windows, patio doors, and entry doors — properly flashed and sealed against Georgia heat and storms.", icon: "window", active: true, order: 3 },
    { id: "s4", name: "Roofing & Gutters", description: "Roof repair, replacement, and seamless gutters — from targeted fixes to full tear-offs, done to manufacturer spec.", icon: "home", active: true, order: 4 },
    { id: "s5", name: "Siding & Exteriors", description: "New siding, trim, and exterior repairs that protect your home and refresh its curb appeal.", icon: "shield", active: true, order: 5 },
    { id: "s6", name: "Kitchen & Bath Remodeling", description: "Full kitchen and bathroom renovations — layout, fixtures, and finishes built with clean, careful craftsmanship.", icon: "wrench", active: true, order: 6 },
    { id: "s7", name: "Cabinets & Countertops", description: "Custom and stock cabinetry plus countertop installation — kitchens, baths, laundry, and built-ins done right.", icon: "cabinet", active: true, order: 7 },
    { id: "s8", name: "Flooring", description: "Hardwood, tile, and luxury vinyl flooring — professionally installed to look great and hold up to daily life.", icon: "floor", active: true, order: 8 },
    { id: "s9", name: "Home Remodeling & Additions", description: "Whole-home remodels, basement finishes, and room additions that add space, function, and value to your home.", icon: "hammer", active: true, order: 9 },
  ],

  whyChooseUs: [
    { id: "w1", title: "One contractor for every project", description: "Deck, windows, roof, or remodel — you get one accountable crew instead of juggling multiple trades.", order: 1 },
    { id: "w2", title: "Straight answers on repair vs. replace", description: "We'll fix what can be fixed instead of pushing work you don't need.", order: 2 },
    { id: "w3", title: "Clean, respectful job sites", description: "Landscape protection and thorough daily cleanup, every time.", order: 3 },
    { id: "w4", title: "Written warranties you can hold us to", description: "Clear workmanship and manufacturer warranty details in writing before we start.", order: 4 },
  ],

  process: [
    { id: "p1", title: "Free on-site estimate", description: "We visit your home, take measurements and photos, and walk you through your options — no pressure, no jargon.", order: 1 },
    { id: "p2", title: "Clear written proposal", description: "You get an itemized quote with material options and warranty details so you can decide with confidence.", order: 2 },
    { id: "p3", title: "Permits, scheduling & prep", description: "We pull any required permits, confirm a date, order materials, and protect your property before work begins.", order: 3 },
    { id: "p4", title: "Professional construction", description: "Our trained crew completes the build to spec, keeping you updated at every stage.", order: 4 },
    { id: "p5", title: "Cleanup & final walkthrough", description: "We clean up the site, haul away debris, and review the finished work with you before we call it done.", order: 5 },
  ],

  faqs: [
    { id: "f1", question: "What kinds of projects do you take on?", answer: "We're a full-service general contractor. Most commonly we build decks, porches, and pergolas; replace windows, patio doors, and entry doors; install roofing and gutters; put on new siding; install flooring, cabinets, and countertops; and handle kitchen, bath, and whole-home remodels and additions. If you're not sure whether your project fits, just ask.", active: true, order: 1 },
    { id: "f2", question: "How much will my project cost?", answer: "It depends on the size, materials, and scope of the work. That's why we provide a free, itemized written estimate after seeing your project in person rather than quoting a number over the phone.", active: true, order: 2 },
    { id: "f4", question: "Do you handle permits?", answer: "Yes. When a project requires a permit — decks, additions, and structural work often do — we handle the paperwork and inspections so you don't have to.", active: true, order: 4 },
    { id: "f5", question: "How long does a project take?", answer: "It varies by scope. A window replacement or deck may take a few days, while a larger remodel can run several weeks. We'll give you a realistic timeline for your specific project in your written proposal.", active: true, order: 5 },
    { id: "f6", question: "What areas do you serve?", answer: "We're based in Alpharetta and serve homeowners across North Fulton and the surrounding metro Atlanta area, including Roswell, Milton, Johns Creek, Cumming, Woodstock, and Sandy Springs.", active: true, order: 6 },
  ],

  // Real customer reviews go here. Add them from the admin panel (or a Google
  // reviews link) as you collect them — none are shown until they're genuine.
  testimonials: [],

  // No projects are shown yet. Add real jobs (with real photos) via the admin panel.
  projects: [],

  seo: {
    siteUrl: SITE_URL,
    defaultTitlePattern: "{page} | {business}",
    defaultDescription:
      "Locally owned general contractor in Alpharetta, GA. Decks, pergolas, doors, windows, siding, " +
      "roofing, flooring, cabinets, countertops, and remodels. Honest, careful work — free written " +
      "estimates across North Fulton & metro Atlanta.",
    defaultSocialImage: "/demo/og-default.svg",
    gaMeasurementId: null,
    gtmContainerId: null,
    gscVerification: null,
    bingVerification: null,
    pages: {
      home: {
        title: "General Contractor in Alpharetta, GA | Lazer Eye Construction",
        description:
          "Trusted local contractor in Alpharetta, GA. Decks, pergolas, doors, windows, siding, roofing, flooring, cabinets, countertops, and " +
          "remodels across North Fulton & metro Atlanta. Honest work, free estimates.",
        socialTitle: null,
        socialDescription: null,
        socialImage: null,
        canonicalOverride: null,
        noindex: false,
        targetPhrase: "general contractor Alpharetta GA",
      },
      about: {
        title: "About Lazer Eye Construction | Local Alpharetta Contractor",
        description:
          "Meet Josh Olmem, the owner-operator behind Lazer Eye Construction, serving Alpharetta and North " +
          "Fulton with 20+ years of experience. Decks, windows, roofing, and remodels with honest " +
          "assessments and written warranties.",
        socialTitle: null,
        socialDescription: null,
        socialImage: null,
        canonicalOverride: null,
        noindex: false,
        targetPhrase: "Alpharetta construction company",
      },
      gallery: {
        title: "Project Gallery | Lazer Eye Construction, Alpharetta GA",
        description:
          "Browse recent deck, pergola, window, roofing, and remodel projects across Alpharetta and North " +
          "Fulton by Lazer Eye Construction.",
        socialTitle: null,
        socialDescription: null,
        socialImage: null,
        canonicalOverride: null,
        noindex: false,
        targetPhrase: "construction projects Alpharetta",
      },
    },
  },

  footer: {
    aboutBlurb:
      "Lazer Eye Construction is a locally owned general contractor serving Alpharetta and North Fulton " +
      "with decks, pergolas, doors, windows, siding, roofing, flooring, cabinets, countertops, and " +
      "remodels — backed by written warranties.",
    legalDisclaimer:
      "Lazer Eye Construction is a general contractor serving the greater Alpharetta, Georgia area.",
  },
};

export type { SiteConfig } from "./types";
