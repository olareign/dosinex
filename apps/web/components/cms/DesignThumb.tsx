import type { PageTemplateId } from "@/content/page-templates";

const W = 120;
const H = 84;

/** A tiny drawing of each page design: enough to tell the three apart at a glance. Decorative; the label names it. */
export function DesignThumb({ id }: { id: PageTemplateId }) {
  return (
    <svg
      className="cms-design-thumb"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {id === "spotlight" && (
        <>
          <rect width={W} height={H} fill="#f6f7fc" />
          <rect width={W} height="46" fill="#0c0e1d" />
          <circle cx="98" cy="8" r="26" fill="#6366f1" opacity=".45" />
          <rect x="8" y="14" width="46" height="8" rx="2" fill="#e9eaf8" />
          <rect x="8" y="25" width="34" height="8" rx="2" fill="#e9eaf8" />
          <rect x="8" y="37" width="24" height="3" rx="1.5" fill="#a5b4fc" />
          <rect x="76" y="10" width="30" height="34" rx="6" fill="#818cf8" />
          <rect x="6" y="52" width="66" height="26" rx="5" fill="#64748b" />
          <rect x="76" y="52" width="38" height="26" rx="5" fill="#94a3b8" />
          <rect x="10" y="68" width="30" height="3" rx="1.5" fill="#fff" />
        </>
      )}
      {id === "editorial" && (
        <>
          <rect width={W} height={H} fill="#fbf7f0" />
          <rect x="8" y="9" width="40" height="3" rx="1.5" fill="#b4532a" />
          <rect x="8" y="16" width="56" height="9" rx="2" fill="#2a2118" />
          <rect x="8" y="28" width="44" height="9" rx="2" fill="#2a2118" />
          <rect x="8" y="42" width="60" height="2.5" rx="1.2" fill="#c9bca8" />
          <rect x="8" y="47" width="52" height="2.5" rx="1.2" fill="#c9bca8" />
          <path d="M82 46 V22 a16 16 0 0 1 32 0 V46 Z" fill="#e8c9b3" />
          <rect x="8" y="58" width="104" height="1" fill="#2a2118" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="8" y={63 + i * 7} width="52" height="3" rx="1.5" fill="#2a2118" opacity=".8" />
              <rect x="96" y={62 + i * 7} width="16" height="5" rx="1.5" fill="#d9ccb7" />
            </g>
          ))}
        </>
      )}
      {id === "bento" && (
        <>
          <rect width={W} height={H} fill="#eef0fb" />
          <rect x="6" y="6" width="68" height="40" rx="7" fill="#fff" />
          <rect x="12" y="14" width="40" height="7" rx="2" fill="#0f172a" />
          <rect x="12" y="24" width="28" height="7" rx="2" fill="#0f172a" />
          <rect x="12" y="36" width="22" height="3" rx="1.5" fill="#4338ca" />
          <rect x="78" y="6" width="36" height="40" rx="7" fill="#a5b4fc" />
          <rect x="6" y="50" width="34" height="28" rx="7" fill="#d4f1e1" />
          <rect x="44" y="50" width="34" height="28" rx="7" fill="#fde5d1" />
          <rect x="82" y="50" width="32" height="13" rx="6" fill="#4338ca" />
          <rect x="82" y="66" width="32" height="12" rx="6" fill="#fff0bd" />
        </>
      )}
    </svg>
  );
}
