import { useEffect, useRef, useState } from "react";
import { FlowGraph, type FlowConfig } from "./FlowGraph";
import { Modal } from "./Modal";
import { ReviewMonitorScene } from "./ReviewMonitorScene";
import { SupportChatScene } from "./SupportChatScene";
import { PaymentReconScene } from "./PaymentReconScene";
import { DailyDigestScene } from "./DailyDigestScene";

type SiteWork = {
  kind: "site";
  title: string;
  url: string;
  slug: string;
  /**
   * Set when the captured thumbnail is not usable — sayahat.webp is a 906-byte
   * near-black loading splash, so the card renders a typographic tile instead
   * of a black rectangle. Remove this once the screenshot is re-captured.
   */
  poster?: "typographic";
};

type AgentWork = {
  kind: "agent";
  title: string;
  flow: FlowConfig;
  scene?: "review-monitor" | "support-chat" | "payment-recon" | "daily-digest";
};

type Work = SiteWork | AgentWork;

const flowReviews: FlowConfig = {
  variant: "fan-in-radar",
  inputs: ["2gis.svg", "flamp.svg", "instagram.svg"],
  hub: true,
  outputs: ["telegram.svg", "gmail.svg"],
  caption:
    "Агент следит за новыми отзывами на разных площадках, оценивает тональность и присылает алерт с готовым черновиком ответа.",
  captionsIn: ["2ГИС", "Flamp", "Instagram"],
  captionsOut: ["Telegram", "Gmail"],
  captionHub: "Мониторинг",
};

const flowSupport: FlowConfig = {
  variant: "symmetric-h",
  inputs: ["whatsapp.svg", "telegram.svg"],
  hub: true,
  outputs: ["slack.svg", "amocrm.svg"],
  caption:
    "Агент отвечает на типовые вопросы клиентов сам, а сложные обращения передаёт команде и заводит карточку в CRM.",
  captionsIn: ["WhatsApp", "Telegram"],
  captionsOut: ["Slack", "amoCRM"],
  captionHub: "Ответ",
};

const flowPayments: FlowConfig = {
  variant: "fan-out",
  inputs: ["kaspi.svg", "google-sheets.svg"],
  hub: true,
  outputs: ["amocrm.svg", "gmail.svg", "telegram.svg"],
  caption:
    "Агент сверяет входящие платежи с таблицей, обновляет статус сделки, отправляет клиенту чек и присылает сводку по деньгам за день.",
  captionsIn: ["Kaspi", "Google Sheets"],
  captionsOut: ["amoCRM", "Gmail", "Telegram"],
  captionHub: "Сверка",
};

const flowAssistant: FlowConfig = {
  variant: "funnel-merge",
  inputs: ["google-calendar.svg", "gmail.svg", "notion.svg"],
  hub: true,
  outputs: ["telegram.svg"],
  caption:
    "По утрам агент собирает встречи, важные письма и задачи, а затем присылает короткую сводку дня одним сообщением.",
  captionsIn: ["Google Calendar", "Gmail", "Notion"],
  captionsOut: ["Telegram"],
  captionHub: "Сводка",
};

/* site titles provisional; real thumbnails can replace the wireframe later */
const WORKS: Work[] = [
  { kind: "site", title: "Магазин керамики", url: "https://www.mycelion.store/", slug: "mycelion" },
  { kind: "agent", title: "Мониторинг отзывов", flow: flowReviews, scene: "review-monitor" },
  {
    kind: "site",
    title: "Промо AR-очков",
    url: "https://www.auroraxr1.store/#vision",
    slug: "aurora",
  },
  { kind: "agent", title: "Первая линия поддержки", flow: flowSupport, scene: "support-chat" },
  { kind: "site", title: "Личный сайт-портфолио", url: "https://www.qyran.online/", slug: "qyran" },
  { kind: "agent", title: "Контроль оплат и сверка", flow: flowPayments, scene: "payment-recon" },
  {
    kind: "site",
    title: "Тайский массаж-салон",
    url: "https://www.planasthai.space/",
    slug: "planasthai",
  },
  { kind: "agent", title: "Ассистент дня", flow: flowAssistant, scene: "daily-digest" },
  {
    kind: "site",
    title: "Travel-агентство",
    url: "https://www.sayahat.site/",
    slug: "sayahat",
    poster: "typographic",
  },
];

/**
 * Pill tags beside the heading. Every string is a WORKS[].title rendered a few
 * hundred pixels below — no new claim is made here.
 */
const WORKS_PILLS = ["Мониторинг отзывов", "Личный сайт-портфолио", "Контроль оплат и сверка"];

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "") + (u.pathname !== "/" ? u.pathname : "");
  } catch {
    return url;
  }
}

function SiteMockup({
  domain,
  slug,
  poster,
  label,
}: {
  domain?: string;
  slug?: string;
  poster?: "typographic";
  label?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = !!slug && !imgFailed && !poster;
  return (
    <div className="site-mockup" aria-hidden="true">
      <div className="site-mockup-chrome">
        <span className="site-mockup-dot" />
        <span className="site-mockup-dot" />
        <span className="site-mockup-dot" />
        <div className="site-mockup-url">{domain ?? ""}</div>
      </div>
      <div className="site-mockup-body">
        {poster ? (
          /* Honest degradation, not a fabricated screenshot: the domain and the
             work's own title on a tinted surface, in the card's shape. */
          <div className="site-poster">
            <span className="site-poster-domain">{domain ?? ""}</span>
            {label ? <span className="site-poster-label">{label}</span> : null}
          </div>
        ) : showImg ? (
          <img
            className="site-mockup-shot"
            src={`/works/${slug}.webp`}
            alt=""
            width={480}
            height={300}
            onError={() => setImgFailed(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <div className="site-mockup-nav">
              <span />
              <span />
              <span />
            </div>
            <div className="site-mockup-hero" />
            <div className="site-mockup-line" />
            <div className="site-mockup-line short" />
          </>
        )}
      </div>
    </div>
  );
}

/**
 * `variant` is the work's index within a single set (0-8), never the index in
 * the doubled track. The rotation pattern therefore repeats with period 9,
 * exactly the marquee's wrap period, so card N and card N+9 are identical and
 * the seam stays invisible.
 */
function WorkCard({ work, onOpen, variant }: { work: Work; onOpen: () => void; variant: number }) {
  return (
    <button type="button" className={`work-card wk-${variant + 1}`} onClick={onOpen}>
      <div className="work-preview">
        {work.kind === "site" ? (
          <SiteMockup
            domain={extractDomain(work.url)}
            slug={work.slug}
            poster={work.poster}
            label={work.title}
          />
        ) : work.scene === "review-monitor" ? (
          <ReviewMonitorScene size="card" />
        ) : work.scene === "support-chat" ? (
          <SupportChatScene size="card" />
        ) : work.scene === "payment-recon" ? (
          <PaymentReconScene size="card" />
        ) : work.scene === "daily-digest" ? (
          <DailyDigestScene size="card" />
        ) : (
          <FlowGraph config={work.flow} size="mini" />
        )}
      </div>
      <div className="work-foot">
        <div className="work-title">{work.title}</div>
        <span className="work-hint">Открыть →</span>
      </div>
    </button>
  );
}

function SiteModalBody({ item }: { item: SiteWork }) {
  return (
    <div className="works-modal-site">
      <div className="works-modal-site-frame">
        <iframe
          src={item.url}
          title={item.title}
          className="works-modal-iframe"
          sandbox="allow-scripts allow-same-origin allow-popups"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <a
        className="btn btn-primary btn-sm"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Открыть сайт ↗
      </a>
    </div>
  );
}

function AgentModalBody({ item }: { item: AgentWork }) {
  const caption =
    item.scene === "support-chat"
      ? "Простые вопросы агент закрывает сам, сложные передаёт команде и заводит карточку в CRM."
      : item.scene === "payment-recon"
        ? "Агент сверяет платежи с таблицей, обновляет статус сделки, отправляет чек и присылает сводку по деньгам за день."
        : item.scene === "daily-digest"
          ? "По утрам агент собирает встречи, письма и задачи, а затем присылает короткую сводку дня одним сообщением."
          : item.flow.caption;
  return (
    <div className="works-modal-agent">
      <div className="works-modal-flow-wrap">
        {item.scene === "review-monitor" ? (
          <div className="review-scene-wrap-full">
            <ReviewMonitorScene size="full" />
          </div>
        ) : item.scene === "support-chat" ? (
          <div className="support-chat-wrap-full">
            <SupportChatScene size="full" />
          </div>
        ) : item.scene === "payment-recon" ? (
          <div className="payment-recon-wrap-full">
            <PaymentReconScene size="full" />
          </div>
        ) : item.scene === "daily-digest" ? (
          <div className="daily-digest-wrap-full">
            <DailyDigestScene size="full" />
          </div>
        ) : (
          <FlowGraph config={item.flow} size="full" />
        )}
      </div>
      <p className="works-modal-caption">{caption}</p>
    </div>
  );
}

export function StudentWorks() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const singleWidthRef = useRef(0);
  const hoveredRef = useRef(false);
  const openRef = useRef(false);

  openRef.current = openIndex !== null;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const firstDup = track.children[WORKS.length] as HTMLElement | undefined;
      if (first && firstDup) {
        singleWidthRef.current = firstDup.offsetLeft - first.offsetLeft;
      } else {
        singleWidthRef.current = track.scrollWidth / 2;
      }
    };
    measure();
    const retry = window.setTimeout(measure, 400);
    const ro = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    ro?.observe(track);

    let raf = 0;
    let last = performance.now();
    const speed = 100;

    const step = (t: number) => {
      const dt = t - last;
      last = t;
      if (!hoveredRef.current && !openRef.current && singleWidthRef.current > 0) {
        posRef.current -= (dt / 1000) * speed;
        if (posRef.current <= -singleWidthRef.current) {
          posRef.current += singleWidthRef.current;
        }
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(retry);
      ro?.disconnect();
    };
  }, []);

  const openItem = openIndex !== null ? WORKS[openIndex] : null;
  const doubled = WORKS.concat(WORKS);

  return (
    <section id="works" className="block works">
      <div className="wrap">
        <div className="head-wrap reveal">
          <p className="eyebrow">Работы учеников</p>
          <h2 className="h2">Что собирают на курсе</h2>
          <p className="section-lead">
            Реальные сайты и автоматизации из финальных проектов. Наведи на любую карточку и открой,
            чтобы посмотреть внутри.
          </p>
          {/* aria-hidden: each tag repeats a card title from the track below.
              The slot carries .reveal's translate, the pill carries the
              rotation, so neither transform overwrites the other. */}
          <div className="works-pills" aria-hidden="true">
            {WORKS_PILLS.map((pill, i) => (
              <div key={pill} className={`works-pill-slot wp-${i + 1} reveal`} data-delay={i + 1}>
                <span className="works-pill">{pill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="works-viewport reveal"
        onPointerEnter={() => {
          hoveredRef.current = true;
        }}
        onPointerLeave={() => {
          hoveredRef.current = false;
        }}
      >
        <div className="works-track" ref={trackRef}>
          {doubled.map((work, i) => (
            <WorkCard
              key={i}
              work={work}
              variant={i % WORKS.length}
              onOpen={() => setOpenIndex(i % WORKS.length)}
            />
          ))}
        </div>
      </div>

      <Modal
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        title={openItem?.title ?? ""}
        tag={openItem?.kind === "site" ? "Сайт" : "Автоматизация"}
      >
        {openItem?.kind === "site" ? (
          <SiteModalBody item={openItem} />
        ) : openItem?.kind === "agent" ? (
          <AgentModalBody item={openItem} />
        ) : null}
      </Modal>
    </section>
  );
}
