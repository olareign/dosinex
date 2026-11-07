import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/sp/Button";
import { ThemeScope } from "@/components/theme/ThemeScope";
import { fraunces } from "@/app/fonts";
import { currentRole, profileStats } from "@/content/derive";
import { ActionBar } from "../ActionBar";
import { CvDownload } from "../CvDownload";
import { ViewBeacon } from "../ViewBeacon";
import { whatsappHref, type PageContext } from "../view-model";
import { TemplateEffects } from "./TemplateEffects";
import { TplProjects } from "./TplProjects";
import {
  Portrait,
  TplContact,
  TplCredentials,
  TplExperience,
  TplFooter,
  TplHeader,
  TplTestimonials,
} from "./shared";

/**
 * Editorial: a calm, warm reading layout. A serif name over an arched portrait, an introduction that reads like a
 * letter, and work and career set as clean lists. Built to be read, which suits job seekers and professionals.
 */
export function Editorial(ctx: PageContext) {
  const { site, slug, preview } = ctx;
  const { profile } = site;
  const stats = profileStats(site);
  const current = currentRole(site);
  const eyebrow = [profile.headline, profile.availability].filter(Boolean).join(" · ");

  return (
    <ThemeScope className={`tpl tpl--editorial ${fraunces.variable}`} defaultTheme={site.settings.theme}>
      <TplHeader {...ctx} variant="editorial" />
      <main>
        <section className="ed-hero" aria-labelledby="hero-name">
          <div className="tpl-wrap ed-hero-grid">
            <div className="ed-copy">
              {eyebrow && <p className="tpl-kicker">{eyebrow}</p>}
              <h1 id="hero-name" className="ed-name">
                {profile.name}
              </h1>
              {profile.location && (
                <p className="ed-place">
                  <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
                  {profile.location}
                  {current && (
                    <>
                      <span aria-hidden="true"> · </span>
                      {current.role} at {current.company}
                    </>
                  )}
                </p>
              )}
              {profile.summary && <p className="ed-lede">{profile.summary}</p>}
              <div className="tpl-actions">
                {profile.whatsapp && (
                  <Button
                    href={whatsappHref(site)}
                    variant="cta"
                    className="pp-hide-sm"
                    target="_blank"
                    rel="noopener"
                    icon={<MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />}
                  >
                    WhatsApp {profile.firstName}
                  </Button>
                )}
                <Button href="#contact" icon={<Mail size={18} strokeWidth={1.75} aria-hidden="true" />}>
                  Write to {profile.firstName}
                </Button>
                <CvDownload slug={slug} publishedAt={site.publishedAt} preview={preview} />
              </div>
              {stats.length > 0 && (
                <dl className="ed-stats">
                  {stats.map((s) => (
                    <div key={s.caption}>
                      <dt>{s.caption}</dt>
                      <dd>{s.figure}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="ed-portrait" aria-hidden={profile.avatar ? undefined : true}>
              <Portrait site={site} sizes="(max-width: 900px) 70vw, 380px" priority />
            </div>
          </div>
        </section>
        <TplProjects {...ctx} variant="editorial" />
        <TplExperience {...ctx} />
        <TplCredentials {...ctx} competencies />
        <TplTestimonials {...ctx} />
        <TplContact {...ctx} variant="editorial" />
      </main>
      <TplFooter {...ctx} />
      <ActionBar {...ctx} />
      {!preview && <ViewBeacon slug={slug} />}
      <TemplateEffects />
    </ThemeScope>
  );
}
