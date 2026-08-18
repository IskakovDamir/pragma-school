import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { STUDENT_CASES, TRACK_LABEL } from "@/data/studentCases";
import { highlightStats } from "@/lib/highlightStats";

/** First letter of the first two words of a name, for the no-photo avatar. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** Scrolling animates unless the reader has asked it not to. */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export function StudentCases() {
  const railRef = useRef<HTMLDivElement>(null);
  const metrics = useRef({ step: 0, maxScroll: 0 });
  // Dots count reachable scroll positions, not cards. With five cards, a 376px
  // step and only 600px of scroll at 1440, one dot per card left the last two
  // permanently dead — no scroll offset can ever make card 4 or 5 the leftmost
  // one. Pages are derived from the rail's own geometry, so the count falls out
  // of whatever the viewport happens to be.
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const total = STUDENT_CASES.length;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      const card = rail.querySelector<HTMLElement>(".case-card");
      if (!card) return;
      // Measured, not hardcoded: the card width is a media query away from
      // changing, and a ResizeObserver re-runs this whenever it does.
      const step = card.offsetWidth + (parseFloat(getComputedStyle(rail).columnGap) || 0);
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      metrics.current = { step, maxScroll };

      const canScroll = maxScroll > 1;
      const pageCount = canScroll && step > 0 ? Math.ceil(maxScroll / step) + 1 : 1;
      setScrollable(canScroll);
      setPages(pageCount);
      setActive(step > 0 ? Math.min(pageCount - 1, Math.round(rail.scrollLeft / step)) : 0);
      setAtStart(rail.scrollLeft <= 1);
      setAtEnd(rail.scrollLeft >= maxScroll - 1);
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    // Catches viewport resizes, the mobile breakpoint swapping the card width,
    // and any late layout shift such as a webfont landing.
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) =>
    railRef.current?.scrollBy({
      left: direction * metrics.current.step,
      behavior: scrollBehavior(),
    });

  const scrollToPage = (page: number) =>
    railRef.current?.scrollTo({
      // The last page is clamped to maxScroll, which is what makes it reachable
      // at all — page * step would overshoot the end of the rail.
      left: Math.min(page * metrics.current.step, metrics.current.maxScroll),
      behavior: scrollBehavior(),
    });

  // The section is gated on the data itself, not on a separate flag: no real,
  // consented quotes means no section at all — no heading, no empty state, no
  // skeleton. Returned after the hooks so hook order stays stable.
  if (total === 0) return null;

  // Nothing to page through if every card already fits: no dots, no arrows.
  const showControls = total > 1 && scrollable;

  return (
    <section id="cases" className="block">
      <div className="wrap">
        <div className="head-wrap center reveal">
          <div className="eyebrow">Результаты</div>
          <h2 className="h2">Истории наших учеников</h2>
          <p className="section-lead">Реальные задачи, которые они закрыли автоматизацией.</p>
        </div>

        <div className="cases">
          {/* The rail deliberately no longer carries tabIndex. It had one to
              give itself arrow-key scrolling back when nothing inside it was
              focusable; now every card is a link, so a tab stop on the
              scroller would be a sixth stop with nothing to do at it, landed
              on immediately before the five that do. A scroll container needs
              its own tab stop only while it holds no focusable children —
              arrow keys scroll the nearest scrollable ancestor of whatever is
              focused, so arrow-key scrolling survives (verified, not assumed).
              role and label stay: they are what name the region. */}
          <div className="cases-rail" ref={railRef} role="group" aria-label="Истории учеников">
            {STUDENT_CASES.map((student, i) => (
              /* The whole card is the target, not a "подробнее" tucked into a
                 corner: the card already summarises exactly one thing, and the
                 reader is aiming at the card, not at a word inside it. */
              <Link
                to="/stories/$slug"
                params={{ slug: student.slug }}
                className="case-card"
                key={student.slug}
                /* Without this the accessible name is the entire card read
                   aloud, teaser numbers and all. Same shape as the detail
                   page's own <title>, so the link announces what it opens. */
                aria-label={`${student.name}: ${student.headline}`}
              >
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
                      /* Each portrait's own intrinsic size, so the reserved box
                         has the right shape before the file lands. All five
                         ratios differ, so one shared pair would shift four. */
                      width={student.photoWidth}
                      height={student.photoHeight}
                      /* Only the first card is on screen at any width, so it is
                         the one worth fetching up front; the rest wait until
                         the rail is scrolled toward them. */
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      decoding="async"
                    />
                  ) : (
                    <div className="case-photo case-photo-avatar" aria-hidden="true">
                      <span className="case-photo-initials">{initialsOf(student.name)}</span>
                    </div>
                  )}
                  {/* Name only. `role` is filled for the three corporate
                      students now, and it used to render here too — a second
                      line in the band would have grown into the 38px the
                      portrait stops short of, on the three cards that have
                      one and not the two that do not. The job title belongs to
                      the detail page, where there is room for it. */}
                  <div className="case-meta">
                    <strong className="case-name">{student.name}</strong>
                  </div>
                </div>
              </Link>
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
              {/* One button per reachable position. They are the only control
                  left below 860px, where the arrows are hidden, so they carry
                  a 44px tap target around a 7px dot. */}
              <div className="cases-dots">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`cases-dot${i === active ? " is-active" : ""}`}
                    aria-label={`Показать карточки ${i + 1} из ${pages}`}
                    aria-current={i === active ? "true" : undefined}
                    onClick={() => scrollToPage(i)}
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
