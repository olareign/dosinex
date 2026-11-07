/*
 * The designs a public page can wear. The owner picks ONE in Dashboard → Design; visitors never choose. The content
 * and behaviour (enquiries, WhatsApp, CV download, privacy switches) are identical in all of them; only the layout,
 * type and colour treatment differ. Kept free of imports so the schemas can use the ids.
 */

export const PAGE_TEMPLATE_IDS = ["spotlight", "editorial", "bento"] as const;
export type PageTemplateId = (typeof PAGE_TEMPLATE_IDS)[number];

export const DEFAULT_PAGE_TEMPLATE: PageTemplateId = "spotlight";

export const PAGE_TEMPLATES: Record<PageTemplateId, { label: string; tagline: string; description: string }> = {
  spotlight: {
    label: "Spotlight",
    tagline: "Bold and photo-led",
    description:
      "A dark, full-bleed opening with your photo and big type, then large picture tiles for your work. Stands out for freelancers, creators and builders.",
  },
  editorial: {
    label: "Editorial",
    tagline: "Warm and story-first",
    description:
      "A calm reading layout with serif headings, your career as a story and a clean list of work. Reads well for job seekers, teachers, nurses and researchers.",
  },
  bento: {
    label: "Bento",
    tagline: "Bright and glanceable",
    description:
      "Everything in friendly colour-tinted cards, so a visitor sees who you are, where you are and how to reach you in one screen. Great on phones.",
  },
};

/** The id for a stored or posted value, or null when it is missing or unknown. */
export function parsePageTemplate(value: unknown): PageTemplateId | null {
  return PAGE_TEMPLATE_IDS.find((id) => id === value) ?? null;
}

/** The design a page wears. Total on purpose: a document saved before the setting existed gets the default. */
export function publicPageTemplate(settings: { pageTemplate?: PageTemplateId }): PageTemplateId {
  return parsePageTemplate(settings.pageTemplate) ?? DEFAULT_PAGE_TEMPLATE;
}
