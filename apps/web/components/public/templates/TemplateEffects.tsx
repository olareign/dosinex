"use client";

import { useEffect } from "react";

/**
 * Fades sections in as they scroll into view. Progressive on purpose: the page is fully visible when this script
 * has not run (no JavaScript, crawlers, print), and the effect never starts for visitors who asked for reduced
 * motion. It only touches a `data-fx` flag on the page root and a `data-in` flag on elements marked `data-reveal`.
 */
export function TemplateEffects() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".tpl");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      return;
    }
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    root.dataset.fx = "on";
    targets.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      delete root.dataset.fx;
      targets.forEach((el) => delete el.dataset.in);
    };
  }, []);
  return null;
}
