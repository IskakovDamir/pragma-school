import { useState } from "react";
import { STUDENT_CASES } from "@/data/studentCases";

/** First letter of the first two words of a name, for the no-photo avatar. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function StudentCases() {
  const [index, setIndex] = useState(0);
  const total = STUDENT_CASES.length;

  // The section is gated on the data itself, not on a separate flag: no real,
  // consented quotes means no section at all — no heading, no empty state, no
  // skeleton. Returned after the hook so hook order stays stable.
  if (total === 0) return null;

  const current = STUDENT_CASES[index % total];
  // A single case has nothing to page through, so the controls and the counter
  // are not rendered at all.
  const showControls = total > 1;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section id="cases" className="block">
      <div className="wrap">
        <div className="head-wrap center reveal">
          <div className="eyebrow">Результаты</div>
          <h2 className="h2">Истории наших учеников</h2>
          <p className="section-lead">Реальные задачи, которые они закрыли автоматизацией.</p>
        </div>

        <div className="cases">
          <article className="case-card">
            {current.photo ? (
              <img
                className="case-photo-img"
                src={current.photo}
                alt={current.name}
                width={220}
                height={293}
                loading="lazy"
              />
            ) : (
              <div className="case-photo case-photo-avatar" aria-hidden="true">
                <span className="case-photo-initials">{initialsOf(current.name)}</span>
              </div>
            )}
            <div className="case-body">
              <blockquote className="case-quote">
                {current.quote.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </blockquote>
              <div className="case-meta">
                <strong className="case-name">{current.name}</strong>
                <span className="case-role">{current.role}</span>
              </div>
              {current.projectUrl && current.projectLabel ? (
                <a
                  className="case-project"
                  href={current.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {current.projectLabel} ↗
                </a>
              ) : null}
            </div>
          </article>

          {showControls ? (
            <div className="cases-controls">
              <button
                type="button"
                className="case-arrow"
                aria-label="Предыдущая история"
                onClick={prev}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <span className="cases-counter">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                className="case-arrow"
                aria-label="Следующая история"
                onClick={next}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
