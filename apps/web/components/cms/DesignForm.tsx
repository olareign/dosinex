"use client";

import { ExternalLink, Monitor, Smartphone } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { savePageTemplateAction } from "@/app/(admin)/dashboard/actions";
import { PAGE_TEMPLATE_IDS, PAGE_TEMPLATES, type PageTemplateId } from "@/content/page-templates";
import { DesignThumb } from "./DesignThumb";
import { SaveBar } from "./SaveBar";
import { useUnsavedChanges } from "./UnsavedChanges";

type Device = "desktop" | "phone";
/** The width the desktop preview is laid out at before it is scaled down to fit the panel. */
const DESKTOP_WIDTH = 1280;

/**
 * Dashboard → Design. The owner picks the ONE design their public page wears; visitors never choose. Right: the saved
 * draft drawn in the design being looked at (before saving too), at desktop or phone width. The choice reaches the
 * public page when they publish, like every other change.
 */
export function DesignForm({ initial, draftVersion }: { initial: PageTemplateId; draftVersion: string }) {
  const [chosen, setChosen] = useState<PageTemplateId>(initial);
  const [baseline, setBaseline] = useState<PageTemplateId>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(0.5);
  const frameRef = useRef<HTMLDivElement>(null);

  // The draft version changes whenever the draft is saved, so the preview redraws after edits made elsewhere.
  const src = `/preview?design=${chosen}&embed=1&v=${encodeURIComponent(draftVersion)}`;

  // Fit the desktop layout to the panel by scaling it, so the owner sees the real desktop page, small.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setScale(Math.min(1, el.clientWidth / DESKTOP_WIDTH));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const save = async (): Promise<boolean> => {
    setSubmitting(true);
    setMessage(null);
    const result = await savePageTemplateAction({ pageTemplate: chosen });
    setSubmitting(false);
    if (!result.ok) {
      setMessage(result.formError ?? Object.values(result.fieldErrors)[0] ?? "Couldn't save. Try again.");
      return false;
    }
    setBaseline(chosen);
    setSavedAt(result.at);
    return true;
  };
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void save();
  };
  useUnsavedChanges(chosen !== baseline, save);

  const frameStyle =
    device === "desktop"
      ? ({
          width: DESKTOP_WIDTH,
          height: `calc(100% / ${scale})`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        } as const)
      : undefined;

  return (
    <div className="cms-design">
      <form onSubmit={onSubmit} noValidate className="cms-design-pick">
        <section className="cms-section" aria-labelledby="sec-design">
          <h2 id="sec-design">How your page looks</h2>
          <p>
            Pick the design visitors see. Your content stays exactly the same in every design, so you can try each one.
            Changes reach your public page when you publish.
          </p>
          {message && (
            <p className="sp-alert" role="alert">
              {message}
            </p>
          )}
          <fieldset className="cms-design-grid">
            <legend className="sp-visually-hidden">Page design</legend>
            {PAGE_TEMPLATE_IDS.map((id) => {
              const on = chosen === id;
              return (
                <label key={id} className="cms-design-card" data-on={on}>
                  <input
                    type="radio"
                    name="pageTemplate"
                    value={id}
                    checked={on}
                    onChange={() => {
                      setMessage(null);
                      setChosen(id);
                    }}
                  />
                  <DesignThumb id={id} />
                  <span className="cms-design-text">
                    <strong>
                      {PAGE_TEMPLATES[id].label}
                      {id === baseline && <em className="cms-design-live">Current</em>}
                    </strong>
                    <span className="cms-design-tagline">{PAGE_TEMPLATES[id].tagline}</span>
                    <span className="sp-field-hint">{PAGE_TEMPLATES[id].description}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>
          <SaveBar submitting={submitting} dirty={chosen !== baseline} savedAt={savedAt} />
        </section>
      </form>

      <section className="cms-design-preview" aria-labelledby="sec-design-preview">
        <div className="cms-design-preview-head">
          <h2 id="sec-design-preview">Preview: {PAGE_TEMPLATES[chosen].label}</h2>
          <div className="cms-design-tools">
            <div className="cms-design-toggle" role="group" aria-label="Preview size">
              <button type="button" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}>
                <Monitor size={16} strokeWidth={1.75} aria-hidden="true" /> Desktop
              </button>
              <button type="button" aria-pressed={device === "phone"} onClick={() => setDevice("phone")}>
                <Smartphone size={16} strokeWidth={1.75} aria-hidden="true" /> Phone
              </button>
            </div>
            <a
              className="sp-annot cms-cv-open"
              href={`/preview?design=${chosen}`}
              target="_blank"
              rel="noopener"
            >
              Open full size <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
        <p className="sp-field-hint">Drawn from your saved draft. Save your edits first to see them here.</p>
        <div className="cms-design-frame" data-device={device} ref={frameRef}>
          {loadedSrc !== src && (
            <p className="cms-cv-loading" role="status">
              Drawing your page…
            </p>
          )}
          <iframe
            key={`${src}-${device}`}
            title={`Page preview, ${PAGE_TEMPLATES[chosen].label} design`}
            src={src}
            style={frameStyle}
            onLoad={() => setLoadedSrc(src)}
          />
        </div>
      </section>
    </div>
  );
}
