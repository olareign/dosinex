import { Award, BookOpen, ExternalLink, GraduationCap, MessageCircle, Quote } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/sp/Button";
import { CoverImage } from "@/components/sp/CoverImage";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { yearRange } from "@/content/cms";
import { initials, publishedDate, visibleReferees } from "@/content/derive";
import type { PageTemplateId } from "@/content/page-templates";
import { CvDownload } from "../CvDownload";
import { EnquiryForm } from "../EnquiryForm";
import { whatsappHref, type PageContext } from "../view-model";

/*
 * The parts of a public page that every design shares. They render the same content and carry the same behaviour
 * (WhatsApp, CV download, enquiry form, privacy switches); each design styles them through its own stylesheet.
 */

type Variant = PageTemplateId;

/** The sections this page actually has, in reading order. Anchors match the ones project pages link back to. */
function sectionLinks({ site, basePath }: PageContext, workLabel: string) {
  return [
    site.projects.length > 0 && { href: `${basePath}#projects`, label: workLabel },
    site.experiences.length > 0 && { href: `${basePath}#experience`, label: "Experience" },
    (site.certifications.length > 0 || site.education.length > 0 || site.research || site.competencies.length > 0) && {
      href: `${basePath}#credentials`,
      label: "Credentials",
    },
    { href: `${basePath}#contact`, label: "Contact" },
  ].filter((l): l is { href: string; label: string } => Boolean(l));
}

export function TplHeader(ctx: PageContext & { variant: Variant }) {
  const { site, basePath, variant } = ctx;
  const links = sectionLinks(ctx, variant === "editorial" ? "Selected work" : "Work");
  const hasWhatsApp = Boolean(site.profile.whatsapp);
  return (
    // The Spotlight header is always dark glass, to sit on its dark opening whichever theme the page is in.
    <header className={`tpl-header tpl-header--${variant}`} data-theme={variant === "spotlight" ? "blueprint" : undefined}>
      <div className="tpl-wrap tpl-header-in">
        <Link href={basePath} className="tpl-brand">
          <span className="tpl-mono" aria-hidden="true">
            {initials(site.profile.name)}
          </span>
          <span className="tpl-brand-name">{site.profile.name}</span>
        </Link>
        <nav className="tpl-nav" aria-label="Page sections">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          {hasWhatsApp && (
            <Button
              href={whatsappHref(site)}
              size="sm"
              variant={variant === "editorial" ? "default" : "cta"}
              target="_blank"
              rel="noopener"
              icon={<MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />}
            >
              WhatsApp
            </Button>
          )}
        </nav>
        <ThemeToggle fallback={site.settings.theme} className="tpl-theme" />
        <MobileMenu
          className="tpl-menu"
          label="Page sections"
          links={links}
          footer={
            hasWhatsApp ? (
              <Button
                href={whatsappHref(site)}
                variant="primary"
                target="_blank"
                rel="noopener"
                icon={<MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />}
              >
                WhatsApp {site.profile.firstName}
              </Button>
            ) : undefined
          }
        />
      </div>
    </header>
  );
}

/** The person's photo, or their initials on a colour field when they have not added one. */
export function Portrait({ site, sizes, priority }: { site: PageContext["site"]; sizes: string; priority?: boolean }) {
  const { avatar, name } = site.profile;
  if (avatar) {
    return <CoverImage cover={{ url: avatar, alt: `Portrait of ${name}`, kind: "upload" }} sizes={sizes} priority={priority} />;
  }
  return (
    <span className="tpl-initials" role="img" aria-label={`Initials of ${name}`}>
      {initials(name)}
    </span>
  );
}

export function SectionHead({ id, kicker, title, aside }: { id: string; kicker: string; title: string; aside?: ReactNode }) {
  return (
    <div className="tpl-head" data-reveal>
      <div>
        <span className="tpl-kicker">{kicker}</span>
        <h2 id={id} className="tpl-title">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

export function TplExperience({ site, basePath }: PageContext) {
  if (site.experiences.length === 0) return null;
  return (
    <section id="experience" className="tpl-section tpl-experience" aria-labelledby="experience-title">
      <div className="tpl-wrap">
        <SectionHead id="experience-title" kicker="Career" title="Experience" />
        <ol className="tpl-jobs">
          {site.experiences.map((e) => {
            const current = e.endYear === undefined;
            const projects = site.projects.filter((p) => p.experienceId === e.id);
            return (
              <li key={e.id} className="tpl-job" data-current={current} data-reveal>
                <span className="tpl-job-years">{yearRange(e.startYear, e.endYear)}</span>
                <div className="tpl-job-body">
                  <h3 className="tpl-job-company">{e.company}</h3>
                  <p className="tpl-job-role">
                    {e.role}
                    {current && <span className="tpl-now">Now</span>}
                  </p>
                  {e.notes && <p className="tpl-job-notes">{e.notes}</p>}
                  {projects.length > 0 && (
                    <ul className="tpl-job-projects" aria-label={`Projects at ${e.company}`}>
                      {projects.map((p) => (
                        <li key={p.id}>
                          <Link href={`${basePath}/projects/${p.id}`}>{p.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Certifications, education, research and (optionally) core competencies. */
export function TplCredentials({ site, competencies }: PageContext & { competencies?: boolean }) {
  const { certifications, education, research } = site;
  const skills = competencies ? site.competencies : [];
  if (!certifications.length && !education.length && !research && !skills.length) return null;
  return (
    <section id="credentials" className="tpl-section tpl-credentials" aria-labelledby="credentials-title">
      <div className="tpl-wrap">
        <SectionHead id="credentials-title" kicker="Qualifications" title="Credentials" />
        <div className="tpl-creds">
          {certifications.map((c) => (
            <article key={c.id} className="tpl-cred" data-reveal>
              <span className="tpl-cred-icon" aria-hidden="true">
                <Award size={22} strokeWidth={1.75} />
              </span>
              <span className="tpl-kicker">Certification · {c.year}</span>
              <h3>{c.title}</h3>
              <p>{c.issuer}</p>
              {c.fileUrl && (
                <a href={c.fileUrl} target="_blank" rel="noopener" className="tpl-link">
                  View certificate <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
          {education.length > 0 && (
            <article className="tpl-cred" data-reveal>
              <span className="tpl-cred-icon" aria-hidden="true">
                <GraduationCap size={22} strokeWidth={1.75} />
              </span>
              <span className="tpl-kicker">Education</span>
              <ul>
                {education.map((e) => (
                  <li key={e.id}>
                    <h3>{e.qualification}</h3>
                    <p>
                      {e.institution} · {yearRange(e.startYear, e.endYear)}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          )}
          {research && (
            <article className="tpl-cred" data-reveal>
              <span className="tpl-cred-icon" aria-hidden="true">
                <BookOpen size={22} strokeWidth={1.75} />
              </span>
              <span className="tpl-kicker">Research · {research.year}</span>
              <h3>{research.title}</h3>
              {research.summary && <p>{research.summary}</p>}
            </article>
          )}
        </div>
        {skills.length > 0 && (
          <ul className="tpl-skills" aria-label="Core competencies" data-reveal>
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function TplTestimonials({ site }: PageContext) {
  if (site.testimonials.length === 0) return null;
  return (
    <section className="tpl-section tpl-testimonials" aria-labelledby="testimonials-title">
      <div className="tpl-wrap">
        <SectionHead id="testimonials-title" kicker="Kind words" title="What people say" />
        <div className="tpl-quotes">
          {site.testimonials.map((t) => (
            <figure key={t.id} className="tpl-quote" data-reveal>
              <Quote className="tpl-quote-mark" size={28} strokeWidth={1.75} aria-hidden="true" />
              <blockquote>{t.body}</blockquote>
              <figcaption>
                <strong>{t.author}</strong>
                <span>{[t.role, t.company].filter(Boolean).join(" · ")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const CONTACT_COPY: Record<Variant, { title: (first: string) => string; text: (first: string) => string }> = {
  spotlight: {
    title: () => "Let’s work together.",
    text: (first) => `Tell ${first} what you have in mind. Replies come by WhatsApp or email.`,
  },
  editorial: {
    title: (first) => `Say hello to ${first}`,
    text: (first) => `A short note is plenty. ${first} replies by WhatsApp or email.`,
  },
  bento: {
    title: (first) => `Message ${first}`,
    text: (first) => `Share a few details and ${first} will get back to you by WhatsApp or email.`,
  },
};

export function TplContact({ site, slug, preview, variant }: PageContext & { variant: Variant }) {
  const { profile } = site;
  const referees = visibleReferees(site);
  const copy = CONTACT_COPY[variant];
  return (
    <section
      id="contact"
      className="tpl-section tpl-contact"
      // The Spotlight closing section is always dark, like its opening.
      data-theme={variant === "spotlight" ? "blueprint" : undefined}
      aria-labelledby="contact-title"
    >
      <div className="tpl-wrap tpl-contact-grid">
        <div className="tpl-contact-intro">
          <span className="tpl-kicker">Get in touch</span>
          <h2 id="contact-title" className="tpl-title tpl-contact-title">
            {copy.title(profile.firstName)}
          </h2>
          <p className="tpl-contact-text">{copy.text(profile.firstName)}</p>
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
            <CvDownload slug={slug} publishedAt={site.publishedAt} preview={preview} />
          </div>
          {referees.length > 0 ? (
            <div className="tpl-referees">
              <span className="tpl-kicker">Referees</span>
              <ul>
                {referees.map((r) => (
                  <li key={r.id}>{[r.name, r.role, r.organisation, r.phone].filter(Boolean).join(" · ")}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="tpl-referees-note">References available on request.</p>
          )}
        </div>
        <div className="tpl-panel">
          <EnquiryForm slug={slug} firstName={profile.firstName} disabled={preview} />
        </div>
      </div>
    </section>
  );
}

export function TplFooter({ site }: PageContext) {
  return (
    <footer className="tpl-footer">
      <div className="tpl-wrap tpl-footer-in">
        <span>{site.publishedAt ? `Last published ${publishedDate(site.publishedAt)}` : "Draft · not yet published"}</span>
        <Link href="/">Made with Dosinex</Link>
      </div>
    </footer>
  );
}
