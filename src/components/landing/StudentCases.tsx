import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  const railRef = useRef<HTMLDivElement>(null);
  // Index of the leftmost card that is not clipped on the left — what the dots
  // report. All five cards are always mounted; only the scroll offset changes.
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const total = STUDENT_CASES.length;

  /** One card plus one gap, measured rather than hardcoded. */
  const stepPx = useCallback(() => {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(".case-card");
    if (!rail || !card) return 0;
    return card.offsetWidth + (parseFloat(getComputedStyle(rail).columnGap) || 0);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      const railLeft = rail.getBoundingClientRect().left;
      const cards = Array.from(rail.querySelectorAll<HTMLElement>(".case-card"));
      // -1 absorbs sub-pixel scroll offsets, which would otherwise read the
      // snapped card as one pixel clipped and skip the dot forward.
      const first = cards.findIndex((c) => c.getBoundingClientRect().left >= railLeft - 1);
      setActive(first === -1 ? cards.length - 1 : first);
      setAtStart(rail.scrollLeft <= 1);
      setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1);
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) =>
    railRef.current?.scrollBy({ left: direction * stepPx(), behavior: "smooth" });

  // The section is gated on the data itself, not on a separate flag: no real,
  // consented quotes means no section at all — no heading, no empty state, no
  // skeleton. Returned after the hooks so hook order stays stable.
  if (total === 0) return null;

  // A single case has nothing to page through.
  const showControls = total > 1;

  return (
    <section id="cases" className="block">
      <div className="wrap">
        <div className="head-wrap center reveal">
          <div className="eyebrow">Результаты</div>
          <h2 className="h2">Истории наших учеников</h2>
          <p className="section-lead">Реальные задачи, которые они закрыли автоматизацией.</p>
        </div>

        <div className="cases">
          {/* tabIndex makes the scroller itself a tab stop, which is what gives
              it arrow-key scrolling: the cards carry no interactive content of
              their own yet, and giving static <article>s a tabindex would add
              focus stops with nothing to do at them. */}
          <div
            className="cases-rail"
            ref={railRef}
            tabIndex={0}
            role="group"
            aria-label="Истории учеников"
          >
            {STUDENT_CASES.map((student) => (
              <article className="case-card" key={student.name}>
                <span className="case-track">{TRACK_LABEL[student.track]}</span>
                <h3 className="case-headline">{student.headline}</h3>
                {/* student.quote is deliberately not rendered here — the card
                    shows the teaser, the full text is the detail page's. */}
                <p className="case-teaser">{highlightStats(student.teaser)}</p>

                {/* The portrait is taller than this block's content box and sits
                    on its floor, so the head rises out of the top edge into the
                    margin above. Kept in CSS — see .case-photo-block. */}
                <div className="case-photo-block">
                  {student.photo ? (
                    <img
                      className="case-photo-img"
                      src={student.photo}
                      alt={student.name}
                      width={304}
                      height={260}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="case-photo case-photo-avatar" aria-hidden="true">
                      <span className="case-photo-initials">{initialsOf(student.name)}</span>
                    </div>
                  )}
                  <div className="case-meta">
                    <strong className="case-name">{student.name}</strong>
                    {student.role ? <span className="case-role">{student.role}</span> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {showControls ? (
            <div className="cases-controls">
              <button
                type="button"
                className="case-arrow"
                aria-label="Предыдущая история"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
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
              {/* Position, not a control: the rail and the arrows are the way
                  through, so this is not exposed twice to a screen reader. */}
              <div className="cases-dots" aria-hidden="true">
                {STUDENT_CASES.map((student, i) => (
                  <span
                    key={student.name}
                    className={`cases-dot${i === active ? " is-active" : ""}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="case-arrow"
                aria-label="Следующая история"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
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
