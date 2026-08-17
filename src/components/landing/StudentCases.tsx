import { useState, type ReactNode } from "react";
import { STUDENT_CASES, TRACK_LABEL } from "@/data/studentCases";

/** First letter of the first two words of a name, for the no-photo avatar. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/**
 * The numbers a reader should catch while skimming a case. Alternatives are
 * ordered longest-form first, so the regex never settles for a prefix:
 *
 *   8:30                 a time — must beat the plain-number branch on "8"
 *   240 000              thousands grouped with a space (also NBSP / narrow NBSP)
 *   1,5%   12%   180     a decimal, a percent, a plain count
 */
const STAT_PATTERN = /\d+:\d{2}|\d{1,3}(?:[ \u00A0\u202F]\d{3})+(?:,\d+)?%?|\d+(?:,\d+)?%?/;

const LETTER = /\p{L}/u;

/**
 * Splits a case body into text and <span className="stat-highlight"> segments.
 *
 * Generic on purpose: nothing is marked up by hand in studentCases.ts, so a new
 * quote gets its numbers highlighted the moment it is pasted in — and a quote
 * with no numbers (Александр's) simply comes back as one plain string.
 *
 * Digits welded to letters are left alone: "n8n" is a tool this school teaches,
 * not a result, and highlighting the 8 inside it would be nonsense.
 */
function highlightStats(text: string): ReactNode[] {
  // A fresh regex per call. STAT_PATTERN is shared and exec() advances
  // lastIndex, so reusing one /g instance would drop matches on the next card.
  const pattern = new RegExp(STAT_PATTERN.source, "g");
  const out: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    // ?? "" covers start === 0 and end === text.length, where the neighbour
    // is undefined rather than a character.
    const welded = LETTER.test(text[start - 1] ?? "") || LETTER.test(text[end] ?? "");
    if (welded) continue;

    if (start > cursor) out.push(text.slice(cursor, start));
    out.push(
      <span className="stat-highlight" key={start}>
        {match[0]}
      </span>,
    );
    cursor = end;
  }

  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
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
            {/* Portrait and attribution share the left rail: the cutout breaks
                the card's top edge, the name sits level with the end of the
                quote. Both are decided in CSS — see .case-figure. */}
            <div className="case-figure">
              {current.photo ? (
                <img
                  className="case-photo-img"
                  src={current.photo}
                  alt={current.name}
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="case-photo case-photo-avatar" aria-hidden="true">
                  <span className="case-photo-initials">{initialsOf(current.name)}</span>
                </div>
              )}
              <div className="case-meta">
                <strong className="case-name">{current.name}</strong>
                {current.role ? <span className="case-role">{current.role}</span> : null}
              </div>
            </div>

            <div className="case-body">
              <div className="case-head">
                <span className="case-track">{TRACK_LABEL[current.track]}</span>
                <h3 className="case-headline">{current.headline}</h3>
              </div>
              <blockquote className="case-quote">
                {current.quote.map((paragraph, i) => (
                  <p key={i}>{highlightStats(paragraph)}</p>
                ))}
              </blockquote>
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
