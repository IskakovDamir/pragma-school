import { useEffect, useState, type CSSProperties } from "react";

export type SceneSize = "card" | "full";

type Stage =
  | "idle"
  | "header"
  | "sources"
  | "assemble"
  | "summary"
  | "toast"
  | "hold"
  | "reset";

const STAGE_ORDER: Stage[] = [
  "idle",
  "header",
  "sources",
  "assemble",
  "summary",
  "toast",
  "hold",
  "reset",
];

const CARD_DUR: Record<Stage, number> = {
  idle: 320,
  header: 480,
  sources: 1400,
  assemble: 820,
  summary: 700,
  toast: 900,
  hold: 800,
  reset: 500,
};
const FULL_DUR: Record<Stage, number> = {
  idle: 420,
  header: 620,
  sources: 1700,
  assemble: 980,
  summary: 850,
  toast: 1050,
  hold: 950,
  reset: 600,
};

interface Source {
  icon: string;
  line1: string;
  line2: string;
  cls: "source-a" | "source-b" | "source-c";
}

const SOURCES: Source[] = [
  {
    icon: "google-calendar.svg",
    line1: "3 встречи",
    line2: "первая в 10:00",
    cls: "source-a",
  },
  {
    icon: "gmail.svg",
    line1: "2 важных письма",
    line2: "ждут ответа",
    cls: "source-b",
  },
  {
    icon: "notion.svg",
    line1: "5 задач на сегодня",
    line2: "одна срочная",
    cls: "source-c",
  },
];

const SUMMARY_LINES = [
  "10:00 — созвон с командой",
  "Ответить: 2 письма",
  "Задачи: 5, одна срочная",
];

interface Props {
  size: SceneSize;
}

/* Target for the merged card (as translateX of its own layout width).
 * Left card (a) moves right by ~120% of its width to reach center;
 * center card (b) doesn't move horizontally; right card (c) moves left. */
const MERGE_TRANSLATE: Record<Source["cls"], string> = {
  "source-a": "120%",
  "source-b": "0%",
  "source-c": "-120%",
};

export function DailyDigestScene({ size }: Props) {
  const [stage, setStage] = useState<Stage>("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStage("hold");
      return;
    }
    const durs = size === "full" ? FULL_DUR : CARD_DUR;
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cur: Stage = "header";
    const tick = () => {
      if (!mounted) return;
      setStage(cur);
      const delay = durs[cur];
      const idx = STAGE_ORDER.indexOf(cur);
      const nextIdx = idx + 1;
      cur = nextIdx >= STAGE_ORDER.length ? "header" : STAGE_ORDER[nextIdx];
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 160);
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [size]);

  const showHeader = stage !== "idle" && stage !== "reset";
  const showChip = stage !== "idle" && stage !== "reset";
  const chipText =
    stage === "summary" || stage === "toast" || stage === "hold"
      ? "Сводка готова"
      : "Собираю день";
  const chipTone: "info" | "success" =
    stage === "summary" || stage === "toast" || stage === "hold" ? "success" : "info";

  const showGlow = stage === "assemble";
  const showSummary =
    stage === "summary" || stage === "toast" || stage === "hold";
  const summaryLifted = stage === "toast" || stage === "hold";
  const showToast = stage === "toast" || stage === "hold";

  // Sources: appear during 'sources' at base pose; during 'assemble' they
  // transition to the merged pose. In other stages they are hidden at merged
  // (post-assemble) or at base (pre-sources) — we pick which one so exit is
  // smooth after the merge and entry is smooth into 'sources'.
  const sourcePose = (cls: Source["cls"], idx: number): CSSProperties => {
    const mergedTx = MERGE_TRANSLATE[cls];
    const atBaseHidden =
      stage === "idle" || stage === "header" || stage === "reset";
    const atBaseVisible = stage === "sources";
    const atMergedTransition = stage === "assemble";
    // After assemble the sources should stay hidden at the merged position so
    // they don't visibly slide back to base.
    const atMergedHidden =
      stage === "summary" || stage === "toast" || stage === "hold";

    let opacity = 0;
    let transform = "translateX(0) scale(1)";
    let transitionDelay = "0ms";

    if (atBaseHidden) {
      opacity = 0;
      transform = "translateX(0) scale(0.95)";
    } else if (atBaseVisible) {
      opacity = 1;
      transform = "translateX(0) scale(1)";
      transitionDelay = `${idx * 200}ms`;
    } else if (atMergedTransition) {
      opacity = 0;
      transform = `translateX(${mergedTx}) scale(0.5)`;
    } else if (atMergedHidden) {
      opacity = 0;
      transform = `translateX(${mergedTx}) scale(0.5)`;
    }
    return { opacity, transform, transitionDelay };
  };

  return (
    <div
      className={`daily-digest-scene daily-digest-scene-${size}`}
      data-stage={stage}
      aria-hidden="true"
    >
      <div className={`digest-header ${showHeader ? "is-visible" : ""}`}>
        <div className="digest-header-clock">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 7 L12 12 L15.4 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="digest-header-clock-ping" />
        </div>
        <div className="digest-header-text">
          <span className="digest-header-time">08:00</span>
          <span className="digest-header-sep">·</span>
          <span className="digest-header-label">Собираю твой день</span>
        </div>
        <div
          className={`digest-chip tone-${chipTone} ${
            showChip ? "is-visible" : ""
          }`}
        >
          <span className="digest-chip-dot" />
          {chipText}
        </div>
      </div>

      <div className="digest-sources">
        {SOURCES.map((s, i) => (
          <div
            key={s.cls}
            className={`digest-source ${s.cls} ${
              stage === "sources" ? "is-lit" : ""
            }`}
            style={sourcePose(s.cls, i)}
          >
            <img src={`/integrations/${s.icon}`} alt="" className="digest-source-icon" loading="lazy" decoding="async" />
            <div className="digest-source-body">
              <div className="digest-source-l1">{s.line1}</div>
              <div className="digest-source-l2">{s.line2}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`digest-glow ${showGlow ? "is-active" : ""}`} aria-hidden="true" />

      <div
        className={`digest-summary ${showSummary ? "is-visible" : ""} ${
          summaryLifted ? "is-lifted" : ""
        }`}
      >
        <div className="digest-summary-head">
          <span className="digest-summary-badge">Готово</span>
          <span className="digest-summary-title">Твой день</span>
        </div>
        <ul className="digest-summary-list">
          {SUMMARY_LINES.map((line) => (
            <li key={line}>
              <span className="digest-summary-tick" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12 l4 4 l10 -10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className={`digest-toast ${showToast ? "is-visible" : ""}`}>
        <img src="/integrations/telegram.svg" alt="" loading="lazy" decoding="async" />
        <span className="digest-toast-text">Telegram · сводка дня отправлена</span>
        <span className="digest-toast-check" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M5 12 l4 4 l10 -10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
