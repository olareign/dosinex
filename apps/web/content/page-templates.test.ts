import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAGE_TEMPLATE,
  PAGE_TEMPLATE_IDS,
  PAGE_TEMPLATES,
  parsePageTemplate,
  publicPageTemplate,
} from "./page-templates";
import { Site, createEmptySite } from "./schemas";

describe("page templates", () => {
  it("describes every design", () => {
    for (const id of PAGE_TEMPLATE_IDS) {
      expect(PAGE_TEMPLATES[id].label).toBeTruthy();
      expect(PAGE_TEMPLATES[id].description).toBeTruthy();
    }
    expect(PAGE_TEMPLATE_IDS).toContain(DEFAULT_PAGE_TEMPLATE);
  });

  it("parses known ids and rejects the rest", () => {
    expect(parsePageTemplate("bento")).toBe("bento");
    expect(parsePageTemplate("Bento")).toBeNull();
    expect(parsePageTemplate(undefined)).toBeNull();
    expect(parsePageTemplate(3)).toBeNull();
  });

  it("falls back to the default for a document saved before the setting existed", () => {
    expect(publicPageTemplate({})).toBe(DEFAULT_PAGE_TEMPLATE);
    expect(publicPageTemplate({ pageTemplate: "editorial" })).toBe("editorial");
  });

  it("gives an older stored site the default design when it is parsed", () => {
    const fresh = createEmptySite({
      name: "Ada Obi",
      firstName: "Ada",
      headline: "Nurse",
      publicEmail: "ada@example.com",
      now: new Date("2026-10-01T10:00:00.000Z"),
    });
    const oldSettings: Record<string, unknown> = { ...fresh.settings };
    delete oldSettings.pageTemplate;
    expect(Site.parse({ ...fresh, settings: oldSettings }).settings.pageTemplate).toBe(DEFAULT_PAGE_TEMPLATE);
  });
});
