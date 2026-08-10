import { Fragment } from "react";

/**
 * Three steps. Copy and icons unchanged from the flat version — only the
 * arrangement changed. Held as a constant so the mobile connector can be
 * interleaved between the cards without repeating the markup three times.
 */
const STEPS = [
  {
    num: "01",
    icon: "M12 5v14M5 12h14",
    title: "Начинаешь с бесплатных уроков",
    body: "Получаешь три урока и материалы. Смотришь в своём темпе, пробуешь собрать что-то маленькое своими руками.",
  },
  {
    num: "02",
    icon: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
    title: "Идёшь по программе",
    body: "Выбираешь трек и проходишь курс с куратором. На каждом уроке разбираем понятный шаг и повторяем его на практике.",
  },
  {
    num: "03",
    icon: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
    title: "Применяешь у себя",
    body: "К финалу у тебя своя автоматизация под свою задачу. Включаешь её в работу и она снимает часть рутины каждый день.",
  },
];

export function Steps() {
  return (
    <section id="how" className="block">
      <div className="wrap">
        <div className="head-wrap center reveal">
          <p className="eyebrow">Как проходит</p>
          <h2 className="h2">Три шага, знакомый ритм</h2>
          <p className="section-lead">
            От первого бесплатного урока до автоматизации, которая работает у тебя на работе.
          </p>
        </div>
        <div className="steps">
          {/*
            Desktop connector. Sits at z-index 0 inside .steps' own stacking
            context (isolation: isolate) — never at z-index -1, so a transform
            on any ancestor cannot drop it behind the page background.
            preserveAspectRatio is left at its default: the curve scales
            uniformly with the container instead of being flattened, and the
            svg is anchored to the wrapper's bottom so the troughs stay tucked
            under the card tops at every width.
          */}
          <div className="steps-line reveal" data-delay="1" aria-hidden="true">
            <svg viewBox="0 0 1164 96" fill="none">
              <path
                d="M0 34 C65 34, 129 88, 194 88 C259 88, 323 10, 388 10 C453 10, 517 88, 582 88 C647 88, 711 10, 776 10 C841 10, 905 88, 970 88 C1035 88, 1099 40, 1164 40"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="7 9"
              />
            </svg>
          </div>

          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              {/* Mobile-only connector: drawn at a fixed 44x44, so it is a
                  designed short segment rather than the desktop wave scaled
                  down. Hidden above 860px. */}
              {i > 0 && (
                <div className={`steps-link sl-${i} reveal`} data-delay={i} aria-hidden="true">
                  <svg viewBox="0 0 44 44" width="44" height="44" fill="none">
                    <path
                      d="M10 0 C10 18, 34 26, 34 44"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="7 9"
                    />
                  </svg>
                </div>
              )}
              <div className={`step-wrap reveal sw-${i + 1}`} data-delay={i + 1}>
                <article className="note step-card">
                  <div className="step-head">
                    <span className="step-num">{step.num}</span>
                    <div className="step-dot">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C95100"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={step.icon} />
                      </svg>
                    </div>
                  </div>
                  <h3>{step.title}</h3>
                  <p className="step-desc">{step.body}</p>
                </article>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
