import { useEffect, useState } from "react";

export type SceneSize = "card" | "full";

type Stage =
  | "idle"
  | "client-easy"
  | "bot-typing"
  | "bot-reply"
  | "client-hard"
  | "escalate-status"
  | "escalate-toasts"
  | "hold"
  | "reset";

const STAGE_ORDER: Stage[] = [
  "idle",
  "client-easy",
  "bot-typing",
  "bot-reply",
  "client-hard",
  "escalate-status",
  "escalate-toasts",
  "hold",
  "reset",
];

const CARD_DUR: Record<Stage, number> = {
  idle: 320,
  "client-easy": 950,
  "bot-typing": 1050,
  "bot-reply": 1600,
  "client-hard": 1300,
  "escalate-status": 700,
  "escalate-toasts": 1500,
  hold: 800,
  reset: 500,
};
const FULL_DUR: Record<Stage, number> = {
  idle: 420,
  "client-easy": 1150,
  "bot-typing": 1300,
  "bot-reply": 2000,
  "client-hard": 1500,
  "escalate-status": 850,
  "escalate-toasts": 1800,
  hold: 950,
  reset: 600,
};

type BubbleKey = "c1" | "bot" | "c2" | "slack" | "amo";

interface Slot {
  top: string;
  opacity: number;
}

const SLOTS: Record<Stage, Record<BubbleKey, Slot>> = {
  idle: {
    c1: { top: "62%", opacity: 0 },
    bot: { top: "62%", opacity: 0 },
    c2: { top: "62%", opacity: 0 },
    slack: { top: "40%", opacity: 0 },
    amo: { top: "68%", opacity: 0 },
  },
  "client-easy": {
    c1: { top: "62%", opacity: 1 },
    bot: { top: "62%", opacity: 0 },
    c2: { top: "62%", opacity: 0 },
    slack: { top: "40%", opacity: 0 },
    amo: { top: "68%", opacity: 0 },
  },
  "bot-typing": {
    c1: { top: "12%", opacity: 1 },
    bot: { top: "60%", opacity: 1 },
    c2: { top: "62%", opacity: 0 },
    slack: { top: "40%", opacity: 0 },
    amo: { top: "68%", opacity: 0 },
  },
  "bot-reply": {
    c1: { top: "8%", opacity: 1 },
    bot: { top: "48%", opacity: 1 },
    c2: { top: "62%", opacity: 0 },
    slack: { top: "40%", opacity: 0 },
    amo: { top: "68%", opacity: 0 },
  },
  "client-hard": {
    c1: { top: "8%", opacity: 0 },
    bot: { top: "48%", opacity: 0 },
    c2: { top: "60%", opacity: 1 },
    slack: { top: "40%", opacity: 0 },
    amo: { top: "68%", opacity: 0 },
  },
  "escalate-status": {
    c1: { top: "8%", opacity: 0 },
    bot: { top: "48%", opacity: 0 },
    c2: { top: "40%", opacity: 1 },
    slack: { top: "40%", opacity: 0 },
    amo: { top: "68%", opacity: 0 },
  },
  "escalate-toasts": {
    c1: { top: "8%", opacity: 0 },
    bot: { top: "48%", opacity: 0 },
    c2: { top: "6%", opacity: 0.55 },
    slack: { top: "38%", opacity: 1 },
    amo: { top: "66%", opacity: 1 },
  },
  hold: {
    c1: { top: "8%", opacity: 0 },
    bot: { top: "48%", opacity: 0 },
    c2: { top: "6%", opacity: 0.55 },
    slack: { top: "38%", opacity: 1 },
    amo: { top: "66%", opacity: 1 },
  },
  reset: {
    c1: { top: "8%", opacity: 0 },
    bot: { top: "48%", opacity: 0 },
    c2: { top: "6%", opacity: 0 },
    slack: { top: "38%", opacity: 0 },
    amo: { top: "66%", opacity: 0 },
  },
};

const BUBBLE_SIDE: Record<BubbleKey, "client" | "agent" | "toast"> = {
  c1: "client",
  bot: "agent",
  c2: "client",
  slack: "toast",
  amo: "toast",
};

const BUBBLE_ICON: Record<BubbleKey, string> = {
  c1: "whatsapp.svg",
  bot: "",
  c2: "telegram.svg",
  slack: "slack.svg",
  amo: "amocrm.svg",
};

const BUBBLE_TEXT: Record<BubbleKey, string> = {
  c1: "Здравствуйте, до скольки вы сегодня работаете?",
  bot: "Сегодня работаем до 22:00, ждём вас!",
  c2: "Пришёл бракованный товар, хочу вернуть деньги на карту.",
  slack: "Slack · новое обращение, нужен оператор",
  amo: "amoCRM · создана сделка: возврат",
};

const STATUS_CHIP: Partial<Record<Stage, { label: string; tone: "info" | "warn" }>> = {
  "client-easy": { label: "Новое обращение", tone: "info" },
  "bot-typing": { label: "Бот отвечает", tone: "info" },
  "bot-reply": { label: "Бот отвечает", tone: "info" },
  "client-hard": { label: "Новое обращение", tone: "info" },
  "escalate-status": { label: "Требует команду", tone: "warn" },
  "escalate-toasts": { label: "Требует команду", tone: "warn" },
  hold: { label: "Передано команде", tone: "warn" },
};

const BUBBLE_KEYS: BubbleKey[] = ["c1", "bot", "c2", "slack", "amo"];

interface Props {
  size: SceneSize;
}

export function SupportChatScene({ size }: Props) {
  const [stage, setStage] = useState<Stage>("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStage("escalate-toasts");
      return;
    }
    const durs = size === "full" ? FULL_DUR : CARD_DUR;
    let mounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cur: Stage = "client-easy";

    const tick = () => {
      if (!mounted) return;
      setStage(cur);
      const delay = durs[cur];
      const idx = STAGE_ORDER.indexOf(cur);
      const nextIdx = idx + 1;
      cur = nextIdx >= STAGE_ORDER.length ? "client-easy" : STAGE_ORDER[nextIdx];
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 160);
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [size]);

  const chip = STATUS_CHIP[stage];

  return (
    <div
      className={`support-chat-scene support-chat-scene-${size}`}
      data-stage={stage}
      aria-hidden="true"
    >
      <div className="support-chat-header">
        <div className="support-chat-title">
          <span className="support-chat-dot" />
          <span>Поддержка</span>
        </div>
        <div
          className={`support-chat-chip ${chip ? `is-visible tone-${chip.tone}` : ""}`}
        >
          {chip?.label ?? ""}
        </div>
      </div>

      <div className="support-chat-msgs">
        {BUBBLE_KEYS.map((k) => {
          const slot = SLOTS[stage][k];
          const side = BUBBLE_SIDE[k];
          const icon = BUBBLE_ICON[k];
          const isTyping = k === "bot" && stage === "bot-typing";
          const showAutoFlag =
            k === "bot" && (stage === "bot-reply" || stage === "client-hard");
          return (
            <div
              key={k}
              className={`support-msg support-msg-${side}`}
              style={{ top: slot.top, opacity: slot.opacity }}
            >
              {side === "client" ? (
                <img
                  className="support-msg-icon"
                  src={`/integrations/${icon}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div className="support-msg-bubble">
                {isTyping ? (
                  <div className="support-typing" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : side === "toast" ? (
                  <>
                    <img
                      className="support-toast-icon"
                      src={`/integrations/${icon}`}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="support-toast-text">{BUBBLE_TEXT[k]}</span>
                    <span className="support-toast-check" aria-hidden="true">
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
                  </>
                ) : (
                  <span className="support-msg-text">{BUBBLE_TEXT[k]}</span>
                )}
              </div>
              {showAutoFlag ? (
                <div className="support-msg-flag" aria-hidden="true">
                  <span className="support-msg-flag-check">
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
                  Решено автоматически
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
