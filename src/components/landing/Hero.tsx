/** Outcome cards above the headline. Logos are the SVGs already in public/integrations/. */
const HERO_CARDS = [
  {
    logo: "/integrations/telegram.svg",
    alt: "Telegram",
    outcome: "сводка дня пришла сама",
    label: "каждое утро",
  },
  {
    logo: "/integrations/kaspi.svg",
    alt: "Kaspi",
    outcome: "оплаты сверены",
    label: "без таблиц",
  },
  {
    logo: "/integrations/2gis.svg",
    alt: "2ГИС",
    outcome: "отзыв разобран",
    label: "за минуту",
  },
  {
    logo: "/integrations/google-sheets.svg",
    alt: "Google Sheets",
    outcome: "заявки в таблице",
    label: "сами",
  },
];

/**
 * Gutter pill tags. Order matters: the first three are the ones kept below
 * 860px, where they collapse into a single upright row under the CTAs.
 */
const HERO_PILLS = [
  "уроки в записи",
  "куратор в чате",
  "свой проект к финалу",
  "живые разборы каждую неделю",
  "материалы остаются навсегда",
  "старт без опыта в коде",
];

export function Hero() {
  return (
    <header className="hero">
      <div className="hero-glow"></div>

      <div className="sketch s1">
        <svg
          viewBox="0 0 120 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 40 C20 12, 42 12, 56 34 S96 54, 116 22" />
        </svg>
      </div>
      <div className="sketch s3">
        <svg
          viewBox="0 0 90 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M45 8 l9 24 25 2 -20 16 7 25 -21 -15 -21 15 7 -25 -20 -16 25 -2z" />
        </svg>
      </div>

      <div className="hero-inner">
        <div className="hero-cluster">
          {/* Curved dashed connector, behind the cards. preserveAspectRatio is
              left at its default so the curves scale uniformly — the steps
              connector's preserveAspectRatio="none" would flatten them. */}
          <div className="hero-cluster-line" aria-hidden="true">
            <svg viewBox="0 0 760 168" fill="none">
              <path
                d="M4 104 C64 148, 132 146, 190 100 C248 54, 316 52, 376 96 C436 140, 504 142, 562 98 C620 54, 692 56, 756 92"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="7 9"
              />
            </svg>
          </div>

          <div className="hero-cards">
            {HERO_CARDS.map((card, i) => (
              <div key={card.alt} className={`hero-card-wrap anim hc-${i + 1}`}>
                <article className="note hero-card">
                  <img
                    className="hero-card-logo"
                    src={card.logo}
                    alt={card.alt}
                    width={22}
                    height={22}
                  />
                  <p className="hero-card-out">{card.outcome}</p>
                  <span className="hero-card-label">{card.label}</span>
                </article>
              </div>
            ))}
          </div>
        </div>

        <h1 className="display">
          <span className="line anim d2">Разберись с ИИ с нуля</span>
          <span className="line anim d3">и собери своего первого</span>
          <span className="line accent anim d3">ИИ-агента за пару недель</span>
        </h1>
        <p className="subhead anim d4">
          Учим собирать автоматизации на ИИ, которые снимают с тебя рутину. Начни с трёх бесплатных
          уроков и посмотри как это работает у тебя. Опыт в коде не нужен.
        </p>
        <div className="hero-cta anim d5">
          <a className="btn btn-primary" href="#free">
            <span className="arrow">→</span> Забрать 3 бесплатных урока
          </a>
          <a className="btn btn-soft" href="#tracks">
            Смотреть курсы
          </a>
        </div>
        <p className="reassure anim d6">Три урока и материалы. Без карты.</p>

        <div className="hero-pills">
          {HERO_PILLS.map((pill, i) => (
            <div key={pill} className={`hero-pill-slot hp-${i + 1}`}>
              <span className="hero-pill">{pill}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
