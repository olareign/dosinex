import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { fraunces } from "@/app/fonts";
import { Button } from "@/components/sp/Button";
import { ThemeScope } from "@/components/theme/ThemeScope";
import { hostOf, projectCover } from "@/content/covers";
import { employerOf, projectYears } from "@/content/derive";
import type { PageTemplateId } from "@/content/page-templates";
import { CATEGORY_LABELS, type Project } from "@/content/schemas";
import { ActionBar } from "../ActionBar";
import { Gallery } from "../Gallery";
import { ViewBeacon } from "../ViewBeacon";
import { whatsappHref, type PageContext } from "../view-model";
import { TemplateEffects } from "./TemplateEffects";
import { TplFooter, TplHeader } from "./shared";

/**
 * One project, in the design the owner chose for the page, so a visitor who opens a project stays in the same look.
 * The markup is shared; each design restyles it (styles/tpl-project.css).
 */
export function ProjectDetail({
  project,
  variant,
  ...ctx
}: PageContext & { project: Project; variant: PageTemplateId }) {
  const { site, basePath, slug, preview } = ctx;
  const employer = employerOf(site, project)?.company;
  const years = projectYears(project);
  const index = site.projects.findIndex((p) => p.id === project.id);
  const prev = site.projects[index - 1];
  const next = site.projects[index + 1];
  const cover = projectCover(project);
  const websiteHost = project.websiteUrl ? hostOf(project.websiteUrl) : undefined;
  const hasCoordinates = project.lat !== undefined && project.lng !== undefined;

  // Only the facts this project has: an empty cell would just be noise in a design that is not a form.
  const facts: [string, string][] = (
    [
      ["Client", project.client],
      ["Employer", employer],
      ["Location", project.location],
      ["Role", project.role],
      ["Year", years],
      ["Category", CATEGORY_LABELS[project.category]],
      ["Coordinates", hasCoordinates ? `${project.lat}, ${project.lng}` : undefined],
    ] as [string, string | undefined][]
  ).filter((f): f is [string, string] => Boolean(f[1]));

  return (
    <ThemeScope
      className={`tpl tpl--${variant} tpl-project ${variant === "editorial" ? fraunces.variable : ""}`.trim()}
      defaultTheme={site.settings.theme}
    >
      <TplHeader {...ctx} variant={variant} />
      <main>
        <section
          className="tpl-proj-head"
          data-theme={variant === "spotlight" ? "blueprint" : undefined}
          aria-labelledby="project-title"
        >
          <div className="tpl-wrap tpl-proj-head-in">
            <Link href={`${basePath}#projects`} className="tpl-back">
              <span aria-hidden="true">←</span> All projects
            </Link>
            <p className="tpl-proj-tags">
              <span className="tpl-proj-cat">{CATEGORY_LABELS[project.category]}</span>
              <span className="tpl-status" data-status={project.status}>
                {project.status === "ongoing" ? "Ongoing" : "Completed"}
              </span>
            </p>
            <h1 id="project-title" className="tpl-proj-title">
              {project.title}
            </h1>
            {facts.length > 0 && (
              <dl className="tpl-facts">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
        <section className="tpl-section tpl-proj-body" aria-label="Project details">
          <div className="tpl-wrap tpl-proj-grid">
            <div className="tpl-proj-media" data-reveal>
              <Gallery images={project.images} cover={cover} title={project.title} websiteHost={websiteHost} />
            </div>
            <div className="tpl-proj-side">
              {project.scope && (
                <div className="tpl-proj-scope" data-reveal>
                  <h2 className="tpl-kicker">What was done</h2>
                  <p>{project.scope}</p>
                </div>
              )}
              {project.websiteUrl && (
                <div data-reveal>
                  <Button
                    href={project.websiteUrl}
                    variant="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />}
                  >
                    Visit {websiteHost}
                  </Button>
                </div>
              )}
              {site.profile.whatsapp && (
                <div className="tpl-proj-card pp-hide-sm" data-reveal>
                  <h2 className="tpl-proj-card-title">Like what you see?</h2>
                  <p>
                    Ask {site.profile.firstName} about {project.title} or about your own project.
                  </p>
                  <Button
                    href={whatsappHref(site, project.title)}
                    variant="cta"
                    target="_blank"
                    rel="noopener"
                    icon={<MessageCircle size={18} strokeWidth={1.75} aria-hidden="true" />}
                  >
                    WhatsApp {site.profile.firstName}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        {(prev || next) && (
          <nav className="tpl-wrap tpl-pager" aria-label="Other projects">
            {prev ? (
              <Link href={`${basePath}/projects/${prev.id}`}>
                <span className="tpl-kicker">← Previous</span>
                <strong>{prev.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`${basePath}/projects/${next.id}`} className="tpl-pager-next">
                <span className="tpl-kicker">Next →</span>
                <strong>{next.title}</strong>
              </Link>
            )}
          </nav>
        )}
      </main>
      <TplFooter {...ctx} />
      <ActionBar {...ctx} context={project.title} />
      {!preview && <ViewBeacon slug={slug} projectId={project.id} />}
      <TemplateEffects />
    </ThemeScope>
  );
}
