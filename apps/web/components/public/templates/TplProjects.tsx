import { SectionHead } from "./shared";
import { ProjectShowcase, type ShowcaseVariant } from "./ProjectShowcase";
import { toShowcaseData, type PageContext } from "../view-model";

const HEADINGS: Record<ShowcaseVariant, { kicker: (n: number) => string; title: string }> = {
  spotlight: { kicker: (n) => `${String(n).padStart(2, "0")} — Work`, title: "Selected work" },
  editorial: { kicker: (n) => (n === 1 ? "One project" : `${n} projects`), title: "Work I’m proud of" },
  bento: { kicker: (n) => (n === 1 ? "1 project" : `${n} projects`), title: "My work" },
};

/** The projects section: same list and filter in every design, drawn the way that design draws a project. */
export function TplProjects({ site, basePath, variant }: PageContext & { variant: ShowcaseVariant }) {
  if (site.projects.length === 0) return null;
  const head = HEADINGS[variant];
  return (
    <section id="projects" className="tpl-section tpl-work" aria-labelledby="projects-title">
      <div className="tpl-wrap">
        <SectionHead id="projects-title" kicker={head.kicker(site.projects.length)} title={head.title} />
        <ProjectShowcase
          projects={site.projects.map((p) => toShowcaseData(site, p))}
          basePath={basePath}
          variant={variant}
        />
      </div>
    </section>
  );
}
