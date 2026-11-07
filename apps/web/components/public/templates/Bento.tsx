import { ArrowUpRight, FileText, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { ThemeScope } from "@/components/theme/ThemeScope";
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
 * Bento: everything in friendly, colour-tinted cards. One screen answers who this is, where they are, what they have
 * done and how to reach them, which is what a visitor from a phone or a chat link wants.
 */
export function Bento(ctx: PageContext) {
  const { site, slug, preview } = ctx;
  const { profile } = site;
  const stats = profileStats(site);
  const current = currentRole(site);
  const hasWhatsApp = Boolean(profile.whatsapp);

  return (
    <ThemeScope className="tpl tpl--bento" defaultTheme={site.settings.theme}>
      <TplHeader {...ctx} variant="bento" />
      <main>
        <section className="bento-hero" aria-labelledby="hero-name">
          <div className="tpl-wrap bento-grid">
            <div className="bento-card bento-intro">
              {profile.availability && (
                <p className="bento-avail">
                  <span className="bento-avail-dot" aria-hidden="true" />
                  {profile.availability}
                </p>
              )}
              <h1 id="hero-name" className="bento-name">
                {profile.name}
              </h1>
              <p className="bento-role">{profile.headline}</p>
              {profile.summary && <p className="bento-summary">{profile.summary}</p>}
            </div>
            <div className="bento-card bento-photo">
              <Portrait site={site} sizes="(max-width: 900px) 90vw, 400px" priority />
            </div>
            {profile.location && (
              <div className="bento-card bento-place" data-tone="1">
                <MapPin size={22} strokeWidth={1.75} aria-hidden="true" />
                <span className="bento-label">Based in</span>
                <strong>{profile.location}</strong>
              </div>
            )}
            {stats.length > 0 && (
              <dl className="bento-card bento-stats" data-tone="0">
                {stats.map((s) => (
                  <div key={s.caption}>
                    <dt>{s.caption}</dt>
                    <dd>{s.figure}</dd>
                  </div>
                ))}
              </dl>
            )}
            {current && (
              <div className="bento-card bento-now" data-tone="2">
                <Sparkles size={22} strokeWidth={1.75} aria-hidden="true" />
                <span className="bento-label">Currently</span>
                <strong>{current.role}</strong>
                <span>{current.company}</span>
              </div>
            )}
            {hasWhatsApp && (
              <a
                className="bento-card bento-action bento-action--wa"
                href={whatsappHref(site)}
                target="_blank"
                rel="noopener"
              >
                <MessageCircle size={26} strokeWidth={1.75} aria-hidden="true" />
                <span>
                  <small>Say hi on</small>
                  WhatsApp
                </span>
                <ArrowUpRight className="bento-action-go" size={22} strokeWidth={2} aria-hidden="true" />
              </a>
            )}
            <div className={`bento-card bento-action bento-action--cv${hasWhatsApp ? "" : " bento-action--wide"}`} data-tone="4">
              <FileText size={26} strokeWidth={1.75} aria-hidden="true" />
              <span>
                <small>Take it with you</small>
                My CV
              </span>
              <CvDownload slug={slug} publishedAt={site.publishedAt} preview={preview} />
            </div>
            {site.competencies.length > 0 && (
              <ul className="bento-card bento-skills" data-tone="3" aria-label="Core competencies">
                {site.competencies.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <TplProjects {...ctx} variant="bento" />
        <TplExperience {...ctx} />
        <TplCredentials {...ctx} />
        <TplTestimonials {...ctx} />
        <TplContact {...ctx} variant="bento" />
      </main>
      <TplFooter {...ctx} />
      <ActionBar {...ctx} />
      {!preview && <ViewBeacon slug={slug} />}
      <TemplateEffects />
    </ThemeScope>
  );
}
