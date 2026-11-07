"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CoverImage } from "@/components/sp/CoverImage";
import { CATEGORY_LABELS, type Category } from "@/content/schemas";
import type { ShowcaseProject } from "../view-model";

export type ShowcaseVariant = "spotlight" | "editorial" | "bento";

/** How many projects show before "Show all": enough to fill the opening rows of each design's grid. */
const INITIAL: Record<ShowcaseVariant, number> = { spotlight: 5, editorial: 6, bento: 5 };

const SIZES: Record<ShowcaseVariant, string> = {
  spotlight: "(max-width: 760px) 100vw, 640px",
  editorial: "160px",
  bento: "(max-width: 760px) 100vw, 640px",
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The projects section body for every page design: a category filter, the first few projects, then "Show all".
 * The same list drives all three designs; only the markup of one project differs.
 */
export function ProjectShowcase({
  projects,
  basePath,
  variant,
}: {
  projects: ShowcaseProject[];
  basePath: string;
  variant: ShowcaseVariant;
}) {
  const [filter, setFilter] = useState<Category | null>(null);
  const [showAll, setShowAll] = useState(false);
  const categories = [...new Set(projects.map((p) => p.category))];
  const matching = filter ? projects.filter((p) => p.category === filter) : projects;
  const visible = showAll ? matching : matching.slice(0, INITIAL[variant]);

  const chip = (value: Category | null, label: string) => (
    <button
      key={label}
      type="button"
      className="tpl-filter"
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
    >
      {label}
    </button>
  );

  return (
    <div className={`tpl-showcase tpl-showcase--${variant}`}>
      {categories.length > 1 && (
        <div className="tpl-filters" role="group" aria-label="Filter projects by category">
          {chip(null, "All")}
          {categories.map((c) => chip(c, CATEGORY_LABELS[c]))}
        </div>
      )}
      <p className="sp-visually-hidden" aria-live="polite">
        Showing {visible.length} of {matching.length} projects
      </p>
      <div className="tpl-projects" data-reveal>
        {visible.map((p, i) => {
          const href = `${basePath}/projects/${p.id}`;
          if (variant === "editorial") {
            return (
              <Link key={p.id} href={href} className="ed-row">
                <span className="ed-row-n" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className="ed-row-main">
                  <strong className="ed-row-title">{p.title}</strong>
                  {p.meta && <span className="ed-row-meta">{p.meta}</span>}
                  {p.summary && <span className="ed-row-sum">{p.summary}</span>}
                </span>
                <span className="ed-row-side">
                  <span>{CATEGORY_LABELS[p.category]}</span>
                  <span>
                    {p.years}
                    {p.status === "ongoing" ? " · ongoing" : ""}
                  </span>
                </span>
                <span className="ed-row-thumb">
                  <CoverImage cover={p.cover} sizes={SIZES.editorial} />
                </span>
              </Link>
            );
          }
          if (variant === "bento") {
            return (
              <Link key={p.id} href={href} className="bento-tile" data-tone={i % 5}>
                <span className="bento-tile-media">
                  <CoverImage cover={p.cover} sizes={SIZES.bento} />
                  <span className="bento-chip">{CATEGORY_LABELS[p.category]}</span>
                </span>
                <span className="bento-tile-body">
                  <span className="bento-tile-text">
                    <strong className="bento-tile-title">{p.title}</strong>
                    {p.meta && <span className="bento-tile-meta">{p.meta}</span>}
                  </span>
                  <span className="bento-go" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={2} />
                  </span>
                </span>
                <span className="bento-tile-foot">
                  <span className="tpl-status" data-status={p.status}>
                    {p.status === "ongoing" ? "Ongoing" : "Completed"}
                  </span>
                  <span>{p.years}</span>
                </span>
              </Link>
            );
          }
          return (
            <Link key={p.id} href={href} className="spot-tile">
              <CoverImage cover={p.cover} sizes={SIZES.spotlight} />
              <span className="spot-tile-shade" aria-hidden="true" />
              <span className="spot-tile-cat">{CATEGORY_LABELS[p.category]}</span>
              <span className="spot-tile-go" aria-hidden="true">
                <ArrowUpRight size={20} strokeWidth={2} />
              </span>
              <span className="spot-tile-body">
                <strong className="spot-tile-title">{p.title}</strong>
                {p.meta && <span className="spot-tile-meta">{p.meta}</span>}
                <span className="spot-tile-foot">
                  <span className="tpl-status" data-status={p.status}>
                    {p.status === "ongoing" ? "Ongoing" : "Completed"}
                  </span>
                  <span>{p.years}</span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      {!showAll && matching.length > visible.length && (
        <div className="tpl-more">
          <button type="button" className="tpl-more-btn" onClick={() => setShowAll(true)}>
            Show all {matching.length} projects
          </button>
        </div>
      )}
    </div>
  );
}
