import { useEffect, useState } from "react";

export type SceneSize = "card" | "full";

type Cycle = "A" | "B";
type Stage =
  | "idle"
  | "arrive"
  | "scan"
  | "sentiment"
  | "reply"
  | "toast"
  | "hold"
  | "exit";

const STAGE_ORDER: Stage[] = [
  "idle",
  "arrive",
  "scan",
  "sentiment",
  "reply",
  "toast",
  "hold",
  "exit",
];

interface CycleData {
  platform: string;
  platformLabel: string;
  stars: 1 | 2 | 3 | 4 | 5;
  reviewText: string;
  sentiment: "neg" | "pos";
  sentimentLabel: string;
  replyText: string;
}

const CYCLES: Record<Cycle, CycleData> = {
  A: {
    platform: "2gis.svg",
    platformLabel: "2ГИС",
    stars: 2,
    reviewText: "Долго ждал заказ, о задержке никто не предупредил.",
    sentiment: "neg",
    sentimentLabel: "Негатив",
    replyText: "Извините за задержку. Уже разбираемся и всё поправим.",
  },
  B: {
    platform: "instagram.svg",
    platformLabel: "Instagram",
    stars: 5,
    reviewText: "Спасибо, всё было супер, обязательно вернёмся!",
    sentiment: "pos",
    sentimentLabel: "Позитив",
    replyText: "Спасибо на добром слове! Ждём вас снова.",
  },
};

const CARD_DUR: Record<Stage, number> = {
  idle: 320,
  arrive: 520,
  scan: 950,
  sentiment: 650,
  reply: 1800,
  toast: 850,
  hold: 720,
  exit: 500,
};
const FULL_DUR: Record<Stage, number> = {
  idle: 420,
  arrive: 640,
  scan: 1150,
  sentiment: 760,
  reply: 2400,
  toast: 1000,
  hold: 900,
  exit: 600,
};

function StarsRow({ filled }: { filled: number }) {
  return (
    <div className={`review-stars s-${filled}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

interface Props {
  size: SceneSize;
}

export function ReviewMonitorScene({ size }: Props) {
  const [cycle, setCycle] = useState<Cycle>("A");
  const [stage, setStage] = useState<Stage>("idle");
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStage("hold");
      setTyped(CYCLES.A.replyText.length);
      return;
    }
    const durs = size === "full" ? FULL_DUR : CARD_DUR;
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let curStage: Stage = "arrive";
    let curCycle: Cycle = "A";

    const tick = () => {
      if (!mounted) return;
      setStage(curStage);
      setCycle(curCycle);
      const delay = durs[curStage];
      if (curStage === "exit") {
        curCycle = curCycle === "A" ? "B" : "A";
        curStage = "idle";
      } else {
        const idx = STAGE_ORDER.indexOf(curStage);
        curStage = STAGE_ORDER[idx + 1];
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 140);
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [size]);

  // Typewriter effect for the reply bubble.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(CYCLES[cycle].replyText.length);
      return;
    }
    if (stage === "reply") {
      const total = CYCLES[cycle].replyText.length;
      const dur = (size === "full" ? FULL_DUR : CARD_DUR).reply;
      const stepMs = Math.max(18, Math.floor((dur - 200) / (total + 2)));
      setTyped(0);
      let i = 0;
      const iv = setInterval(() => {
        i += 1;
        if (i >= total) {
          setTyped(total);
          clearInterval(iv);
        } else {
          setTyped(i);
        }
      }, stepMs);
      return () => clearInterval(iv);
    }
    if (stage === "toast" || stage === "hold") {
      setTyped(CYCLES[cycle].replyText.length);
    }
    if (stage === "idle" || stage === "arrive") {
      setTyped(0);
    }
  }, [stage, cycle, size]);

  const data = CYCLES[cycle];
  const showCard = stage !== "idle" && stage !== "exit";
  const inExit = stage === "exit";
  const showScan = stage === "scan";
  const showChip = stage === "scan";
  const showBadge = stage === "sentiment" || stage === "reply" || stage === "toast" || stage === "hold";
  const showReply = stage === "reply" || stage === "toast" || stage === "hold";
  const showToast = stage === "toast" || stage === "hold";

  const typedText = data.replyText.slice(0, typed);
  const isTyping = stage === "reply" && typed < data.replyText.length;

  return (
    <div
      className={`review-scene review-scene-${size} ${inExit ? "is-exiting" : ""}`}
      data-stage={stage}
      data-cycle={cycle}
      aria-hidden="true"
    >
      <div className={`review-card ${showCard ? "is-visible" : ""}`}>
        <div className="review-card-head">
          <div className="review-platform">
            <img src={`/integrations/${data.platform}`} alt="" />
            <span>{data.platformLabel}</span>
          </div>
          <StarsRow filled={data.stars} />
        </div>
        <p className="review-text">{data.reviewText}</p>

        {showScan ? <div key={`scan-${cycle}`} className="review-scan" /> : null}

        <div
          className={`review-chip ${showChip ? "is-visible" : ""}`}
          key={`chip-${cycle}-${showChip ? "on" : "off"}`}
        >
          <span className="review-chip-dot" />
          <span>Читает отзыв</span>
        </div>

        <div
          className={`review-badge review-badge-${data.sentiment} ${
            showBadge ? "is-visible" : ""
          }`}
        >
          {data.sentimentLabel}
        </div>

        <div className={`review-meter ${showBadge ? "is-visible" : ""}`}>
          <span className="review-meter-track" />
          <span className={`review-meter-needle m-${data.sentiment}`} />
        </div>
      </div>

      <div className={`review-reply ${showReply ? "is-visible" : ""}`}>
        <div className="review-reply-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3 L13.4 9.6 L20 11 L13.4 12.4 L12 19 L10.6 12.4 L4 11 L10.6 9.6 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="review-reply-bubble">
          <span className="review-reply-text">{typedText}</span>
          {isTyping ? <span className="review-cursor" aria-hidden="true" /> : null}
        </div>
      </div>

      <div className={`review-toast ${showToast ? "is-visible" : ""}`}>
        <img className="review-toast-icon" src="/integrations/telegram.svg" alt="" />
        <div className="review-toast-body">
          <div className="review-toast-title">Telegram · черновик готов</div>
        </div>
        <span className="review-toast-check" aria-hidden="true">
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
