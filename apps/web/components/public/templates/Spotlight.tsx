import { Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/sp/Button";
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
 * Spotlight: a dark, full-bleed opening with the person's photo and big type, a ticker of what they are good at,
 * then large picture tiles for their work. Built to make a first impression.
 */
export function Spotlight(ctx: PageContext) {
  const { site, slug, preview } = ctx;
  const { profile } = site;
  const stats = profileStats(site);
  const current = currentRole(site);

  return (
    <ThemeScope className="tpl tpl--spotlight" defaultTheme={site.settings.theme}>
      <TplHeader {...ctx} variant="spotlight" />
      <main>
        <section className="spot-hero" data-theme="blueprint" aria-labelledby="hero-name">
          <div className="tpl-wrap spot-hero-grid">
            <div className="spot-copy">
              {profile.availability && (
                <p className="spot-pill">
                  <span className="spot-pill-dot" aria-hidden="true" />
                  {profile.availability}
                </p>
              )}
              <h1 id="hero-name" className="spot-name">
                {profile.name}
              </h1>
              <p className="spot-role">{profile.headline}</p>
              {profile.summary && <p className="spot-summary">{profile.summary}</p>}
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
                  Send a message
                </Button>
                <CvDownload slug={slug} publishedAt={site.publishedAt} preview={preview} />
              </div>
              {stats.length > 0 && (
                <dl className="spot-stats">
                  {stats.map((s) => (
                    <div key={s.caption} className="spot-stat">
                      <dt>{s.caption}</dt>
                      <dd>{s.figure}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="spot-stage">
              <div className="spot-portrait">
                <div className="spot-portrait-inner">
                  <Portrait site={site} sizes="(max-width: 900px) 80vw, 460px" priority />
                </div>
              </div>
              {profile.location && (
                <p className="spot-chip spot-chip--place">
                  <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
                  {profile.location}
                </p>
              )}
              {current && (
                <p className="spot-chip spot-chip--now">
                  <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    <small>Currently</small>
                    {current.role}, {current.company}
                  </span>
                </p>
              )}
            </div>
          </div>
          {site.competencies.length > 0 && (
            <div className="spot-marquee" aria-label="Core competencies">
              <ul className="spot-marquee-track">
                {site.competencies.map((c) => (
                  <li key={c}>{c}</li>
                ))}
                {/* A second copy lets the ticker loop without a gap; assistive tech reads the first only. */}
                {site.competencies.map((c) => (
                  <li key={`${c}-copy`} aria-hidden="true">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <TplProjects {...ctx} variant="spotlight" />
        <TplExperience {...ctx} />
        <TplCredentials {...ctx} />
        <TplTestimonials {...ctx} />
        <TplContact {...ctx} variant="spotlight" />
      </main>
      <TplFooter {...ctx} />
      <ActionBar {...ctx} />
      {!preview && <ViewBeacon slug={slug} />}
      <TemplateEffects />
    </ThemeScope>
  );
}
