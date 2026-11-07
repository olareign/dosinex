import { publicPageTemplate } from "@/content/page-templates";
import type { Project } from "@/content/schemas";
import "@/styles/tpl-base.css";
import "@/styles/tpl-spotlight.css";
import "@/styles/tpl-editorial.css";
import "@/styles/tpl-bento.css";
import "@/styles/tpl-project.css";
import { ProjectDetail } from "./templates/ProjectDetail";
import type { PageContext } from "./view-model";

/** Project detail (PRD §3.2), in the same design as the owner's profile page. */
export function ProjectPage({ project, ...ctx }: PageContext & { project: Project }) {
  return <ProjectDetail {...ctx} project={project} variant={publicPageTemplate(ctx.site.settings)} />;
}
