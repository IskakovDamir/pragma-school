import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { STUDENT_CASES, TRACK_LABEL, type StudentCase } from "@/data/studentCases";
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

/**
 * THE PALETTE SWITCH. "a" is the warm editorial set, "b" the brighter one;
 * both are defined in styles.css under section[data-palette="..."]. Changing
 * this one character swaps all five card colours and nothing else.
 *
 * On "b" because the card rebuild asked for it by name. Note that it is doing
 * a different job here than it did on the flat card: the colour is now a lit
 * backdrop behind a cutout rather than the card's own surface, and everything
 * below the scrim is near-black on all five, so the palette reads at the top of
 * the frame and barely at the bottom.
 */
const PALETTE: "a" | "b" = "b";

/**
 * The rail renders the five students three times over and keeps the scroll
 * offset inside the middle copy. Passing the last card simply continues into
 * the next copy, which is pixel-identical to the first, and once the scroll
 * settles the offset is moved back by exactly one copy's width — an assignment
 * to scrollLeft, never an animation, between two positions that render the
 * same thing. There is nothing to see, because both frames are the same frame.
 *
 * Four copies, and the count is load-bearing rather than generous. The offset
 * lives in [setWidth, 2*setWidth), so the top of the band is 2*setWidth, and
 * the scroller can only reach that if maxScroll is at least that big. maxScroll
 * shrinks as the viewport grows, because the rail bleeds to the right edge:
 * measured, it is (copies * setWidth + gutters) - (viewport/2 + 568). With
 * three copies that falls below 2*setWidth at a viewport around 2640px, and
 * past that width the browser would silently clamp the last card's target and
 * it could never reach the leading position. A fourth copy pushes the crossover
 * beyond 6000px, i.e. out of reach of any real display. It also leaves two full
 * copies to the right of the band for a hard flick to run into.
 *
 * Copy 1 is the real one. The other three are clones: aria-hidden and
 * tabIndex -1, so a screen reader is told about five students and Tab visits
 * five cards, while the eye and the mouse get twenty.
 */
const SETS = 4;
const REAL_SET = 1;

/** Scrolling animates unless the reader has asked it not to. */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function CaseCard({
  student,
  clone,
  eager,
}: {
  student: StudentCase;
  clone: boolean;
  eager: boolean;
}) {
  return (
    /* The whole card is the target, not a "подробнее" tucked into a corner:
       the card already summarises exactly one thing, and the reader is aiming
       at the card, not at a word inside it. */
    <Link
      to="/stories/$slug"
      params={{ slug: student.slug }}
      className="case-card"
      /* Clones stay clickable — a visible card that does nothing would be
         worse than no loop at all — but they are removed from the
         accessibility tree and from the tab order, so neither a screen reader
         nor the keyboard ever meets the same student twice. */
      aria-hidden={clone ? true : undefined}
      tabIndex={clone ? -1 : undefined}
      /* Without this the accessible name is the entire card read aloud, teaser
         numbers and all. Same shape as the detail page's own <title>, so the
         link announces what it opens. Omitted on clones, which have no
         accessible name to give. */
      aria-label={clone ? undefined : `${student.name}: ${student.headline}`}
    >
      {/* The photograph IS the card: it fills the frame, and the frame crops
          whatever runs past it. Nothing breaks out any more — see
          .case-photo-block, and the reversal noted on .case-card. */}
      <div className="case-photo-block">
        {student.photo ? (
          /* The wrapper carries the shadow that grounds the subject against
             the backdrop. It cannot live on the <img>, because filters are
             applied before masks and the shadow would then be cast by the
             photo's un-faded alpha, drawing a hard line under a body that has
             already dissolved into the scrim. */
          <div className="case-photo-lift">
            <img
              className="case-photo-img"
              src={student.photo}
              alt=""
              /* Per-portrait head normalisation, unchanged from the previous
                 card: --pf sizes the subject and --pf-eye lands every eye line
                 on the same horizon. Only the base unit grew, because the
                 subject now has to fill a frame. See photoScale in
                 data/studentCases.ts for how they were measured. */
              style={
                {
                  "--pf": student.photoScale,
                  "--pf-eye": student.photoEye,
                  "--pf-fade": student.photoFade,
                  "--pf-fade-span": student.photoFadeSpan,
                } as CSSProperties
              }
              /* Each portrait's own intrinsic size, so the reserved box has the
                 right shape before the file lands. All five ratios differ, so
                 one shared pair would shift four. */
              width={student.photoWidth}
              height={student.photoHeight}
              /* Only one card is on screen before the reader touches anything,
                 and it is the FIRST card in the DOM, not the first real one:
                 the rail is server-rendered at offset 0, showing the leading
                 clone, and only jumps into the real copy once the effect runs.
                 The two share a src, so this is one request either way. */
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              decoding="async"
            />
          </div>
        ) : (
          <div className="case-photo-avatar" aria-hidden="true">
            <span className="case-photo-initials">{initialsOf(student.name)}</span>
          </div>
        )}
      </div>

      {/* Decorative: it exists to make the white text below legible over
          whatever the photograph is doing, not to say anything. */}
      <div className="case-scrim" aria-hidden="true" />

      <div className="case-body">
        {/* The teaser is the quote. student.quote is still not rendered here —
            the card shows one line, the full text is the detail page's. */}
        <p className="case-quote">{highlightStats(student.teaser)}</p>
        <div className="case-foot">
          <span className="case-track">{TRACK_LABEL[student.track]}</span>
          <div className="case-who">
            <h3 className="case-name">{student.name}</h3>
            {/* role where the student stated one, headline where they did not,
                so all five cards carry two lines instead of three carrying two.
                Both are already true of that student; neither is invented. */}
            <span className="case-role-line">{student.role ?? student.headline}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StudentCases() {
  const railRef = useRef<HTMLDivElement>(null);
  const metrics = useRef({ step: 0, setWidth: 0 });
  /**
   * Where the rail is heading, when it is heading somewhere under its own
   * steam. Arrow presses chain off this rather than off scrollLeft, so holding
   * the button down advances one card per press instead of collapsing several
   * presses into one while a smooth scroll is still in flight. Cleared the
   * moment the rail comes to rest, or the moment the reader grabs it.
   */
  const target = useRef<number | null>(null);
  const started = useRef(false);
  // One dot per student, which is only honest because of the clones: without
  // them the rail runs out of scrollable width and the last cards can never
  // reach the leading position, which is why this used to count reachable
  // scroll offsets instead and showed two dots at 1920px for five people.
  const [active, setActive] = useState(0);
  const total = STUDENT_CASES.length;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    /** Measured, not derived: a media query is one resize away from changing
        the card width, and the ResizeObserver below re-runs this when it does. */
    const measure = () => {
      const cards = rail.querySelectorAll<HTMLElement>(".case-card");
      const first = cards[0];
      const nextSet = cards[total];
      if (!first) return;
      const step = first.offsetWidth + (parseFloat(getComputedStyle(rail).columnGap) || 0);
      // The distance from a card to its own clone one copy along. Taken from
      // the DOM rather than as total * step so it cannot drift from the layout.
      const setWidth = nextSet ? nextSet.offsetLeft - first.offsetLeft : total * step;
      metrics.current = { step, setWidth };
    };

    /**
     * Bring the offset back inside the middle copy. The move is a plain
     * assignment, so it is instantaneous and paints nothing: the offset lands
     * on the matching card of the neighbouring copy, which is the same card.
     * setWidth is a whole number of steps, so a snapped position stays snapped
     * and the rail cannot be left between two snap points.
     */
    const rebase = () => {
      const { setWidth } = metrics.current;
      if (setWidth <= 0) return;
      const x = rail.scrollLeft;
      if (x >= 2 * setWidth) rail.scrollLeft = x - setWidth;
      else if (x < setWidth) rail.scrollLeft = x + setWidth;
    };

    const syncDots = () => {
      const { step } = metrics.current;
      if (step <= 0) return;
      const lead = Math.round(rail.scrollLeft / step);
      setActive(((lead % total) + total) % total);
    };

    let idle = 0;
    const settle = () => {
      target.current = null;
      rebase();
      syncDots();
    };

    const onScroll = () => {
      syncDots();
      // Rebasing mid-flight would cancel the browser's own smooth scroll or
      // the reader's momentum, so it waits for the rail to stop. Scroll events
      // keep arriving throughout both, which is exactly what holds this off.
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 140);
    };

    // The reader taking hold of the rail invalidates wherever the arrows
    // thought it was going.
    const release = () => {
      target.current = null;
    };

    measure();
    if (!started.current) {
      // Into the middle copy. Not animated, and invisible for the same reason
      // the rebase is: offset 0 shows the leading clone, offset setWidth shows
      // the real card it is a copy of, and they are the same picture.
      rail.scrollLeft = metrics.current.setWidth;
      started.current = true;
    }
    syncDots();

    rail.addEventListener("scroll", onScroll, { passive: true });
    rail.addEventListener("pointerdown", release, { passive: true });
    rail.addEventListener("touchstart", release, { passive: true });
    rail.addEventListener("wheel", release, { passive: true });

    const observer = new ResizeObserver(() => {
      measure();
      // A breakpoint change moves every snap point, so whatever the offset
      // meant a moment ago it does not mean now. Put it back in the band at
      // once rather than waiting for a scroll that may never come.
      rebase();
      syncDots();
    });
    observer.observe(rail);

    return () => {
      window.clearTimeout(idle);
      rail.removeEventListener("scroll", onScroll);
      rail.removeEventListener("pointerdown", release);
      rail.removeEventListener("touchstart", release);
      rail.removeEventListener("wheel", release);
      observer.disconnect();
    };
  }, [total]);

  /**
   * Move `by` cards from wherever the rail is, or from where it is already
   * heading. If that start point is outside the middle copy it is shifted back
   * into it first, along with the rail itself, so an animation never has to
   * cross the end of the content — which is what would make the wrap visible.
   */
  const travel = (by: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const { step, setWidth } = metrics.current;
    if (step <= 0 || setWidth <= 0) return;

    let from = target.current ?? rail.scrollLeft;
    let shift = 0;
    while (from >= 2 * setWidth) {
      from -= setWidth;
      shift -= setWidth;
    }
    while (from < setWidth) {
      from += setWidth;
      shift += setWidth;
    }
    // Same instantaneous, same-picture move as rebase(), done before the
    // animation starts rather than after it finishes.
    if (shift !== 0) rail.scrollLeft = rail.scrollLeft + shift;

    const to = from + by * step;
    target.current = to;
    rail.scrollTo({ left: to, behavior: scrollBehavior() });
  };

  /** The shortest way round to a given student, forwards or backwards. */
  const goToStudent = (index: number) => {
    const { step } = metrics.current;
    const rail = railRef.current;
    if (!rail || step <= 0) return;
    const from = target.current ?? rail.scrollLeft;
    const current = ((Math.round(from / step) % total) + total) % total;
    let by = index - current;
    if (by > total / 2) by -= total;
    if (by < -total / 2) by += total;
    travel(by);
  };

  // The section is gated on the data itself, not on a separate flag: no real,
  // consented quotes means no section at all — no heading, no empty state, no
  // skeleton. Returned after the hooks so hook order stays stable.
  if (total === 0) return null;

  return (
    <section id="cases" className="block" data-palette={PALETTE}>
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
            {Array.from({ length: SETS }, (_, set) =>
              STUDENT_CASES.map((student, i) => (
                <CaseCard
                  key={`${set}-${student.slug}`}
                  student={student}
                  clone={set !== REAL_SET}
                  eager={set === 0 && i === 0}
                />
              )),
            )}
          </div>

          {total > 1 ? (
            <div className="cases-controls">
              {/* Neither arrow ever disables. There is no end to be at. */}
              <button
                type="button"
                className="case-arrow"
                aria-label="Предыдущая история"
                onClick={() => travel(-1)}
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
              {/* One dot per student, not per scroll offset. They are the only
                  control left below 860px, where the arrows are hidden, so
                  they carry a 44px tap target around a 7px dot. */}
              <div className="cases-dots">
                {STUDENT_CASES.map((student, i) => (
                  <button
                    type="button"
                    key={student.slug}
                    className={`cases-dot${i === active ? " is-active" : ""}`}
                    aria-label={`Показать историю: ${student.name}`}
                    aria-current={i === active ? "true" : undefined}
                    onClick={() => goToStudent(i)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="case-arrow"
                aria-label="Следующая история"
                onClick={() => travel(1)}
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
