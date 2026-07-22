import type { SiteConfig } from "./types";

/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH — DEMO CONTENT ("Lazer Eye Construction")
 * ============================================================================
 *
 * This object seeds the database and is also used as a live fallback when no
 * database is connected (so the site builds and renders with zero credentials).
 *
 * To create a new customer site WITHOUT editing source code, use the admin
 * onboarding wizard — it writes to the database, which overrides these values.
 *
 * These defaults exist so the template is never blank and always demonstrates
 * a complete, professional site. All testimonials, projects, and some trust
 * claims below are clearly marked as SAMPLE demonstration content.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://lazereyeconstruction.example.com";

export const defaultSiteConfig: SiteConfig = {
  isDemo: true,

  business: {
    name: "Lazer Eye Construction",
    legalName: "Lazer Eye Construction LLC",
    tagline: "One trusted contractor for every project — done right the first time.",
    phone: "(770) 555-0147",
    email: "estimates@lazereyeconstruction.example.com",
    addressLine: "1420 Birch Street",
    city: "Alpharetta",
    state: "GA",
    zip: "30009",
    showAddress: true,
    licenseInfo: "GA Residential Contractor Lic. #DEMO-000000 (sample)",
    yearsExperience: 18,
    foundedYear: 2007,
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
      "Locally owned, licensed, and insured. From custom decks and pergolas to doors, windows, " +
      "siding, and roofing, we do it all — one accountable crew, plain-language answers, and work " +
      "backed by a written warranty.",
    primaryCtaLabel: "Get a Free Estimate",
    secondaryCtaLabel: "Call Now",
    imageUrl: "/demo/hero-roof.svg",
    imageAlt: "A finished home exterior with a new deck, windows, and roofline on a clear day.",
  },

  about: {
    story:
      "Lazer Eye Construction started in 2007 with a single truck and a simple promise: treat every " +
      "project like it's our own home — because your home deserves that kind of care. Over the years " +
      "we've grown into a trusted full-service crew handling everything from backyard decks and " +
      "pergolas to windows, doors, siding, roofing, and full remodels. We're not the biggest builder " +
      "in the area, and we don't want to be. We want to be the one your neighbor recommends.",
    ownerName: "Dave Marchetti",
    ownerTitle: "Owner & Lead Estimator",
    ownerBio:
      "Dave grew up on job sites and has spent nearly two decades building and remodeling homes " +
      "across metro Atlanta. He personally walks most estimates so homeowners get straight " +
      "answers from the person accountable for the work.",
    experience:
      "Nearly two decades of hands-on building and remodeling experience across Alpharetta and North " +
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
      "Every crew member is trained on job-site and fall-protection safety, and we carry general " +
      "liability and workers' compensation coverage so homeowners are never exposed to job-site risk.",
    community:
      "We live and work in the same neighborhoods we serve. You'll see our trucks at the hardware " +
      "store, our kids at the same schools, and our name on the local little-league banner.",
  },

  trust: [
    { id: "t1", label: "Licensed & Insured", detail: "General liability + workers' comp", isSample: true, active: true, order: 1 },
    { id: "t2", label: "Free Estimates", detail: "No-pressure, written quotes", isSample: false, active: true, order: 2 },
    { id: "t3", label: "Workmanship Warranty", detail: "Written warranty on labor", isSample: true, active: true, order: 3 },
    { id: "t4", label: "Locally Owned", detail: "Based in Alpharetta since 2007", isSample: false, active: true, order: 4 },
    { id: "t5", label: "18+ Years Experience", detail: "Serving metro Atlanta", isSample: false, active: true, order: 5 },
  ],

  services: [
    { id: "s1", name: "Decks & Porches", description: "Custom-built decks and covered porches in wood or low-maintenance composite — designed for how you actually use your backyard.", icon: "deck", active: true, order: 1 },
    { id: "s2", name: "Pergolas & Outdoor Living", description: "Pergolas, arbors, and outdoor structures that add shade, style, and usable living space to your yard.", icon: "leaf", active: true, order: 2 },
    { id: "s3", name: "Doors & Windows", description: "Energy-efficient replacement windows, patio doors, and entry doors — properly flashed and sealed against Georgia heat and storms.", icon: "window", active: true, order: 3 },
    { id: "s4", name: "Roofing & Gutters", description: "Roof repair, replacement, and seamless gutters — from targeted fixes to full tear-offs, done to manufacturer spec.", icon: "home", active: true, order: 4 },
    { id: "s5", name: "Siding & Exteriors", description: "New siding, trim, and exterior repairs that protect your home and refresh its curb appeal.", icon: "shield", active: true, order: 5 },
    { id: "s6", name: "Kitchen & Bath Remodeling", description: "Interior renovations and additions — kitchens, baths, and living spaces built with clean, careful craftsmanship.", icon: "wrench", active: true, order: 6 },
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
    { id: "f1", question: "What kinds of projects do you take on?", answer: "We're a full-service general contractor. Most commonly we build decks, porches, and pergolas; replace windows, patio doors, and entry doors; install roofing and gutters; put on new siding; and handle interior remodels like kitchens and baths. If you're not sure whether your project fits, just ask.", active: true, order: 1 },
    { id: "f2", question: "How much will my project cost?", answer: "It depends on the size, materials, and scope of the work. That's why we provide a free, itemized written estimate after seeing your project in person rather than quoting a number over the phone.", active: true, order: 2 },
    { id: "f3", question: "Are you licensed and insured?", answer: "Yes. We carry general liability and workers' compensation insurance, and we work under the appropriate state credentials. We're glad to provide documentation before any work begins.", active: true, order: 3 },
    { id: "f4", question: "Do you handle permits?", answer: "Yes. When a project requires a permit — decks, additions, and structural work often do — we handle the paperwork and inspections so you don't have to.", active: true, order: 4 },
    { id: "f5", question: "How long does a project take?", answer: "It varies by scope. A window replacement or deck may take a few days, while a larger remodel can run several weeks. We'll give you a realistic timeline for your specific project in your written proposal.", active: true, order: 5 },
    { id: "f6", question: "What areas do you serve?", answer: "We're based in Alpharetta and serve homeowners across North Fulton and the surrounding metro Atlanta area, including Roswell, Milton, Johns Creek, Cumming, Woodstock, and Sandy Springs.", active: true, order: 6 },
  ],

  testimonials: [
    { id: "r1", author: "Sample Homeowner", location: "Alpharetta, GA", quote: "This is sample testimonial content included to demonstrate the layout. Replace it in the admin panel with a real, honest review from an actual customer.", rating: 5, isSample: true, active: true, order: 1 },
    { id: "r2", author: "Sample Homeowner", location: "Roswell, GA", quote: "Sample review text. Real testimonials should describe the customer's actual experience — what the crew built, how communication went, and the result.", rating: 5, isSample: true, active: true, order: 2 },
    { id: "r3", author: "Sample Homeowner", location: "Johns Creek, GA", quote: "Demonstration content only. Once you collect genuine reviews, add them here and consider linking to your Google reviews for credibility.", rating: 5, isSample: true, active: true, order: 3 },
  ],

  projects: [
    {
      id: "g1",
      title: "Custom Composite Deck Build",
      serviceCategory: "Decks & Porches",
      city: "Alpharetta, GA",
      problem: "An aging, splintering wood deck was unsafe and rarely used by the family.",
      work: "Removed the old structure and built a new low-maintenance composite deck with hidden fasteners, aluminum railings, and integrated step lighting.",
      result: "A safe, modern outdoor living space the family now uses year-round, with virtually no upkeep.",
      description: "Sample project: custom composite deck replacement on a two-story Alpharetta home.",
      completedOn: "2025-09-12",
      featured: true,
      active: true,
      order: 1,
      images: [
        { id: "g1a", url: "/demo/project-1-before.svg", alt: "Aging, weathered wood deck before replacement.", kind: "before", order: 1 },
        { id: "g1b", url: "/demo/project-1-after.svg", alt: "New composite deck with aluminum railings after the rebuild.", kind: "after", order: 2 },
      ],
    },
    {
      id: "g2",
      title: "Cedar Pergola & Patio Refresh",
      serviceCategory: "Pergolas & Outdoor Living",
      city: "Roswell, GA",
      problem: "A bare backyard patio got too much afternoon sun to enjoy.",
      work: "Designed and built a cedar pergola with a slatted shade roof, sized to the existing patio and anchored for Georgia wind loads.",
      result: "A shaded, inviting outdoor room that extended the family's usable living space.",
      description: "Sample project: custom cedar pergola over an existing patio in Roswell.",
      completedOn: "2025-07-30",
      featured: true,
      active: true,
      order: 2,
      images: [
        { id: "g2a", url: "/demo/project-2-before.svg", alt: "Open backyard patio before the pergola was added.", kind: "before", order: 1 },
        { id: "g2b", url: "/demo/project-2-after.svg", alt: "New cedar pergola providing shade over the patio.", kind: "after", order: 2 },
      ],
    },
    {
      id: "g3",
      title: "Full-Home Window Replacement",
      serviceCategory: "Doors & Windows",
      city: "Johns Creek, GA",
      problem: "Drafty, fogged-up windows were driving up energy bills and letting in summer heat.",
      work: "Replaced every window with energy-efficient units, properly flashed and sealed, plus a new patio door.",
      result: "A quieter, more comfortable home with noticeably lower cooling costs.",
      description: "Sample project: whole-home energy-efficient window replacement in Johns Creek.",
      completedOn: "2025-06-18",
      featured: false,
      active: true,
      order: 3,
      images: [
        { id: "g3a", url: "/demo/project-3-after.svg", alt: "Newly installed energy-efficient windows on a home.", kind: "standard", order: 1 },
      ],
    },
    {
      id: "g4",
      title: "Roof Replacement & New Siding",
      serviceCategory: "Roofing & Exteriors",
      city: "Milton, GA",
      problem: "Homeowners wanted a durable, refreshed exterior for their forever home.",
      work: "Completed a full roof tear-off and replacement alongside new fiber-cement siding and trim.",
      result: "A weather-tight, low-maintenance exterior with a clean, modern look built to last decades.",
      description: "Sample project: combined roof and siding exterior renovation in Milton.",
      completedOn: "2025-05-02",
      featured: false,
      active: true,
      order: 4,
      images: [
        { id: "g4a", url: "/demo/project-4-after.svg", alt: "Home with a new roof and fresh siding after renovation.", kind: "standard", order: 1 },
      ],
    },
  ],

  seo: {
    siteUrl: SITE_URL,
    defaultTitlePattern: "{page} | {business}",
    defaultDescription:
      "Locally owned general contractor in Alpharetta, GA. Decks, pergolas, doors, windows, siding, and " +
      "roofing. Licensed, insured, and honest — free written estimates across North Fulton & metro Atlanta.",
    defaultSocialImage: "/demo/og-default.svg",
    gaMeasurementId: null,
    gtmContainerId: null,
    gscVerification: null,
    bingVerification: null,
    pages: {
      home: {
        title: "General Contractor in Alpharetta, GA | Lazer Eye Construction",
        description:
          "Trusted local contractor in Alpharetta, GA. Decks, pergolas, doors, windows, siding, roofing, and " +
          "remodels across North Fulton & metro Atlanta. Licensed, insured, free estimates.",
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
          "Meet the locally owned construction crew serving Alpharetta and North Fulton since 2007. Decks, " +
          "windows, roofing, and remodels with honest assessments and written warranties.",
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
      "with decks, pergolas, doors, windows, siding, roofing, and remodels — backed by written warranties.",
    legalDisclaimer:
      "Lazer Eye Construction is shown here with sample demonstration content. Testimonials, projects, " +
      "license numbers, and some claims are examples used to demonstrate the Contractor Website Starter " +
      "template.",
  },
};

export type { SiteConfig } from "./types";
