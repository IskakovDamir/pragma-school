import { useEffect, useState } from "react";

export type SceneSize = "card" | "full";

type Cycle = "A" | "B";
type Stage = "idle" | "incoming" | "search" | "resolve" | "toasts" | "hold" | "reset";

const STAGE_ORDER: Stage[] = [
  "idle",
  "incoming",
  "search",
  "resolve",
  "toasts",
  "hold",
  "reset",
];

const CARD_DUR: Record<Stage, number> = {
  idle: 340,
  incoming: 750,
  search: 1200,
  resolve: 650,
  toasts: 1450,
  hold: 850,
  reset: 500,
};
const FULL_DUR: Record<Stage, number> = {
  idle: 440,
  incoming: 900,
  search: 1500,
  resolve: 800,
  toasts: 1800,
  hold: 1000,
  reset: 600,
};

interface CycleData {
  incomingAmount: string;
  incomingOrder: string;
  matchIndex: number | null;
  amountDelta: number;
  toasts: { icon: string; text: string }[];
  chipSearch: string;
  chipResolve: string;
  chipResolveTone: "success" | "warn";
  crmLine: string | null;
}

const CYCLES: Record<Cycle, CycleData> = {
  A: {
    incomingAmount: "45 000 ₸",
    incomingOrder: "Заказ №1287",
    matchIndex: 1,
    amountDelta: 45000,
    toasts: [
      { icon: "gmail.svg", text: "Gmail · чек отправлен" },
      { icon: "telegram.svg", text: "Telegram · +45 000 ₸ за сегодня" },
    ],
    chipSearch: "Сверяю с таблицей",
    chipResolve: "Совпадение найдено",
    chipResolveTone: "success",
    crmLine: "amoCRM · Сделка №1287 → Оплачено",
  },
  B: {
    incomingAmount: "12 000 ₸",
    incomingOrder: "без номера заказа",
    matchIndex: null,
    amountDelta: 0,
    toasts: [{ icon: "telegram.svg", text: "Telegram · платёж без заказа" }],
    chipSearch: "Сверяю с таблицей",
    chipResolve: "Требует проверки",
    chipResolveTone: "warn",
    crmLine: null,
  },
};

const TABLE_ROWS = [
  { no: "№1281", amount: "22 000 ₸" },
  { no: "№1287", amount: "45 000 ₸" },
  { no: "№1293", amount: "76 000 ₸" },
];

function fmtNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

interface Props {
  size: SceneSize;
}

export function PaymentReconScene({ size }: Props) {
  const [cycle, setCycle] = useState<Cycle>("A");
  const [stage, setStage] = useState<Stage>("idle");
  const [counter, setCounter] = useState(0);

  // State machine
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCycle("A");
      setStage("hold");
      setCounter(CYCLES.A.amountDelta);
      return;
    }
    const durs = size === "full" ? FULL_DUR : CARD_DUR;
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let curStage: Stage = "incoming";
    let curCycle: Cycle = "A";

    const tick = () => {
      if (!mounted) return;
      setStage(curStage);
      setCycle(curCycle);
      const delay = durs[curStage];
      if (curStage === "reset") {
        curCycle = curCycle === "A" ? "B" : "A";
        curStage = "idle";
      } else if (curStage === "idle") {
        curStage = "incoming";
      } else {
        const idx = STAGE_ORDER.indexOf(curStage);
        curStage = STAGE_ORDER[idx + 1];
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 160);
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [size]);

  // Counter animation.
  //   - Cycle A toasts: tick 0 → 45000 via rAF (eased)
  //   - Loop back to cycle A (idle): reset counter to 0
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (stage === "toasts" && cycle === "A") {
      const target = CYCLES.A.amountDelta;
      const dur = size === "full" ? 1200 : 900;
      const start = performance.now();
      let raf = 0;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setCounter(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }
    if (stage === "idle" && cycle === "A") {
      setCounter(0);
    }
  }, [stage, cycle, size]);

  const data = CYCLES[cycle];

  const showIncoming = stage !== "idle" && stage !== "reset";
  const showChip = stage === "search" || stage === "resolve" || stage === "toasts" || stage === "hold";
  const rowsResolved = stage === "resolve" || stage === "toasts" || stage === "hold";
  const showCrmLine = data.crmLine && rowsResolved;
  const showScan = stage === "search";
  const showToasts = stage === "toasts" || stage === "hold";

  const chipText = stage === "search" ? data.chipSearch : data.chipResolve;
  const chipTone: "info" | "success" | "warn" =
    stage === "search" ? "info" : data.chipResolveTone;

  return (
    <div
      className={`payment-recon-scene payment-recon-scene-${size}`}
      data-stage={stage}
      data-cycle={cycle}
      aria-hidden="true"
    >
      <div className="payment-header">
        <div className="payment-header-title">
          <img src="/integrations/google-sheets.svg" alt="" className="payment-header-src" />
          <span>Оплаты</span>
        </div>
        <div className="payment-header-total">
          <span className="payment-header-total-label">Сегодня:</span>
          <span className="payment-header-total-value">{fmtNumber(counter)} ₸</span>
        </div>
      </div>

      <div className={`payment-incoming ${showIncoming ? "is-visible" : ""}`}>
        <img src="/integrations/kaspi.svg" alt="" className="payment-incoming-icon" />
        <div className="payment-incoming-body">
          <div className="payment-incoming-line1">
            Поступление · <b>{data.incomingAmount}</b>
          </div>
          <div className="payment-incoming-line2">{data.incomingOrder}</div>
        </div>
      </div>

      <div
        className={`payment-chip tone-${chipTone} ${showChip ? "is-visible" : ""}`}
      >
        <span className="payment-chip-dot" />
        <span className="payment-chip-text">{chipText}</span>
      </div>

      <div className="payment-table">
        {TABLE_ROWS.map((row, i) => {
          const isMatched = rowsResolved && data.matchIndex === i;
          return (
            <div
              key={row.no}
              className={`payment-row ${isMatched ? "is-matched" : ""}`}
            >
              <span className="payment-row-no">{row.no}</span>
              <span className="payment-row-amount">{row.amount}</span>
              <div className="payment-row-status">
                {isMatched ? (
                  <>
                    <span className="payment-row-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M5 12 l4 4 l10 -10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Оплачено</span>
                  </>
                ) : (
                  <span className="payment-row-status-text">Ожидает</span>
                )}
              </div>
            </div>
          );
        })}
        {showScan ? <div key={`scan-${cycle}-${stage}`} className="payment-scan" /> : null}
      </div>

      <div className={`payment-crm ${showCrmLine ? "is-visible" : ""}`}>
        <img src="/integrations/amocrm.svg" alt="" />
        <span>{data.crmLine ?? ""}</span>
      </div>

      <div className="payment-toasts">
        {data.toasts.map((t, i) => (
          <div
            key={`${cycle}-${i}`}
            className={`payment-toast ${showToasts ? "is-visible" : ""}`}
            style={{ transitionDelay: showToasts ? `${i * 180}ms` : "0ms" }}
          >
            <img src={`/integrations/${t.icon}`} alt="" />
            <span className="payment-toast-text">{t.text}</span>
            <span className="payment-toast-check" aria-hidden="true">
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
        ))}
      </div>
    </div>
  );
}
