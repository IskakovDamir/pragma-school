import { useEffect, useRef, useState } from "react";
import { FlowGraph, type FlowConfig } from "./FlowGraph";
import { Modal } from "./Modal";

type SiteWork = {
  kind: "site";
  title: string;
  url: string;
  slug: string;
};

type AgentWork = {
  kind: "agent";
  title: string;
  flow: FlowConfig;
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
  { kind: "site", title: "Mycelion", url: "https://www.mycelion.store/", slug: "mycelion" },
  { kind: "agent", title: "Мониторинг отзывов", flow: flowReviews },
  { kind: "site", title: "Aurora XR1", url: "https://www.auroraxr1.store/#vision", slug: "aurora" },
  { kind: "agent", title: "Первая линия поддержки", flow: flowSupport },
  { kind: "site", title: "Qyran", url: "https://www.qyran.online/", slug: "qyran" },
  { kind: "agent", title: "Контроль оплат и сверка", flow: flowPayments },
  { kind: "site", title: "Planas Thai", url: "https://www.planasthai.space/", slug: "planasthai" },
  { kind: "agent", title: "Ассистент дня", flow: flowAssistant },
  { kind: "site", title: "Sayahat", url: "https://www.sayahat.site/", slug: "sayahat" },
];

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "") + (u.pathname !== "/" ? u.pathname : "");
  } catch {
    return url;
  }
}

function SiteMockup({ domain, slug }: { domain?: string; slug?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = !!slug && !imgFailed;
  return (
    <div className="site-mockup" aria-hidden="true">
      <div className="site-mockup-chrome">
        <span className="site-mockup-dot" />
        <span className="site-mockup-dot" />
        <span className="site-mockup-dot" />
        <div className="site-mockup-url">{domain ?? ""}</div>
      </div>
      <div className="site-mockup-body">
        {showImg ? (
          <img
            className="site-mockup-shot"
            src={`/works/${slug}.png`}
            alt=""
            onError={() => setImgFailed(true)}
            loading="lazy"
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

function WorkCard({ work, onOpen }: { work: Work; onOpen: () => void }) {
  const tag = work.kind === "site" ? "Сайт" : "Автоматизация";
  return (
    <button type="button" className="work-card" onClick={onOpen}>
      <div className="work-preview">
        {work.kind === "site" ? (
          <SiteMockup domain={extractDomain(work.url)} slug={work.slug} />
        ) : (
          <FlowGraph config={work.flow} size="mini" />
        )}
      </div>
      <div className="work-foot">
        <div className="work-foot-top">
          <span className="work-tag">{tag}</span>
          <span className="work-hint">Открыть →</span>
        </div>
        <div className="work-title">{work.title}</div>
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
  return (
    <div className="works-modal-agent">
      <div className="works-modal-flow-wrap">
        <FlowGraph config={item.flow} size="full" />
      </div>
      <p className="works-modal-caption">{item.flow.caption}</p>
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
    const speed = 68;

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
