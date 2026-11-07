import { publicPageTemplate } from "@/content/page-templates";
import "@/styles/tpl-base.css";
import "@/styles/tpl-spotlight.css";
import "@/styles/tpl-editorial.css";
import "@/styles/tpl-bento.css";
import { Bento } from "./templates/Bento";
import { Editorial } from "./templates/Editorial";
import { Spotlight } from "./templates/Spotlight";
import type { PageContext } from "./view-model";

/**
 * The whole public profile, rendered from one site document (published or draft preview) in the design the owner
 * chose in Dashboard → Design. Every design shows the same content and behaves the same; only the look differs.
 */
export function ProfilePage(ctx: PageContext) {
  switch (publicPageTemplate(ctx.site.settings)) {
    case "editorial":
      return <Editorial {...ctx} />;
    case "bento":
      return <Bento {...ctx} />;
    case "spotlight":
      return <Spotlight {...ctx} />;
  }
}
