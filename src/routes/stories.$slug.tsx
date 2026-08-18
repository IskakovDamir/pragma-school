import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { getStudentBySlug, getStudentNeighbours, TRACK_LABEL } from "@/data/studentCases";
import { highlightStats } from "@/lib/highlightStats";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/stories/$slug")({
  loader: ({ params }) => {
    const student = getStudentBySlug(params.slug);
    // Hands unknown slugs to the root's notFoundComponent rather than growing a
    // second 404 UI here.
    if (!student) throw notFound();
    return student;
  },

  /**
   * The canonical is this route's own responsibility — the root declares none,
   * because links append rather than dedupe and a root-level one would ship
   * twice here (see __root.tsx).
   *
   * og:url is a different mechanism: meta DOES dedupe by property, so the root's
   * homepage value is only a default and gets replaced by the student's below.
   *
   * og:image stays the site-wide card on purpose: a per-student share image is
   * a later nicety, and inheriting one real image beats declaring none.
   */
  head: ({ loaderData }) => {
    // The loader throws before this runs on a miss, but head is typed as though
    // loaderData may be absent. Returning nothing leaves the root's head as-is —
    // which now means a 404 carries no canonical at all, the correct outcome.
    if (!loaderData) return {};

    const title = `${loaderData.name}: ${loaderData.headline} · Pragma School`;
    const url = absoluteUrl(`stories/${loaderData.slug}`);

    return {
      meta: [
        { title },
        { name: "description", content: loaderData.teaser },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.teaser },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: loaderData.teaser },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },

  component: StoryPage,
});

/**
 * The same destination the homepage's three free-lesson CTAs already use —
 * Hero.tsx, Free.tsx and FinalCta.tsx all point here, byte for byte. Not a new
 * URL, and deliberately not a bare "#".
 */
const FREE_LESSONS_URL = "https://pragme-edu.kz/app?course=teaser";

function StoryPage() {
  const student = Route.useLoaderData();
  const neighbours = getStudentNeighbours(student.slug);

  return (
    <>
      {/* Nav and Footer are not in the root route — index.tsx mounts its own and
          so does this page. useLandingBehavior() is deliberately not called:
          it drives hero parallax, magnetic CTAs and the .reveal observer, none
          of which exist here, and no element on this page carries .reveal —
          .reveal without its observer would sit permanently 24px low. */}
      <Nav />

      <main className="story">
        <div className="wrap">
          {/* A route change, so <Link>, not <a href>: the repo's plain anchors
              are for hash targets and external URLs, where they are correct.
              A full document reload between two routes is not. */}
          <Link to="/" hash="cases" className="story-back">
            ← Истории учеников
          </Link>

          {/* story-head-split turns on the two-column grid, and is only applied
              when there is a portrait to put in the second column — otherwise
              the grid would reserve 360px for nothing. */}
          <header className={student.photo ? "story-head story-head-split" : "story-head"}>
            <div className="story-head-text">
              <span className="case-track">{TRACK_LABEL[student.track]}</span>
              <h1 className="story-name">{student.name}</h1>
              <p className="story-headline">{student.headline}</p>
            </div>

            {/* Same construction as the card's photo block, scaled up: the
                portrait is taller than the block's content box and stands on
                its floor, so the head rises out of the top edge into the
                block's margin. See .story-photo-block. */}
            {student.photo ? (
              <div className="story-photo-block">
                <img
                  className="story-photo-img"
                  src={student.photo}
                  alt={student.name}
                  /* This portrait's own intrinsic size, as on the card: all
                     five ratios differ, so one shared pair would shift four. */
                  width={student.photoWidth}
                  height={student.photoHeight}
                  /* The only image above the fold on this page, and the reason
                     the reader clicked through — same treatment the first card
                     in the rail gets. */
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            ) : null}
          </header>

          <div className="story-body">
            {student.quote.map((paragraph, i) => (
              <p key={i}>{highlightStats(paragraph)}</p>
            ))}
          </div>

          {/* Undefined only for a slug not in the array, which the loader has
              already turned into a 404 before this component mounts. */}
          {neighbours ? (
            <nav className="story-nav" aria-label="Другие истории учеников">
              <Link
                to="/stories/$slug"
                params={{ slug: neighbours.prev.slug }}
                className="story-nav-card"
              >
                <span className="story-nav-dir">← Предыдущая история</span>
                <strong className="story-nav-name">{neighbours.prev.name}</strong>
                <span className="story-nav-headline">{neighbours.prev.headline}</span>
              </Link>
              <Link
                to="/stories/$slug"
                params={{ slug: neighbours.next.slug }}
                className="story-nav-card story-nav-card-next"
              >
                <span className="story-nav-dir">Следующая история →</span>
                <strong className="story-nav-name">{neighbours.next.name}</strong>
                <span className="story-nav-headline">{neighbours.next.headline}</span>
              </Link>
            </nav>
          ) : null}

          {/* Copy is FinalCta's, verbatim, rather than a new line written for
              this page. FinalCta itself is not reused because its inner div
              carries .reveal, which needs the landing observer this route does
              not run. */}
          <section className="story-cta">
            <h2 className="story-cta-title">Начни с трёх бесплатных уроков</h2>
            <a
              className="btn btn-primary"
              href={FREE_LESSONS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="arrow">→</span> Забрать бесплатно
            </a>
            <p className="reassure">Три урока и материалы. Без карты.</p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
