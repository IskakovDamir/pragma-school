import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { getStudentBySlug, TRACK_LABEL } from "@/data/studentCases";
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

function StoryPage() {
  const student = Route.useLoaderData();

  return (
    <>
      {/* Nav and Footer are not in the root route — index.tsx mounts its own and
          so does this page. useLandingBehavior() is deliberately not called:
          it drives hero parallax, magnetic CTAs and the .reveal observer, none
          of which exist here, and no element on this page carries .reveal. */}
      <Nav />

      <main className="story">
        <div className="wrap">
          {/* A route change, so <Link>, not <a href>: the repo's plain anchors
              are for hash targets and external URLs, where they are correct.
              A full document reload between two routes is not. */}
          <Link to="/" hash="cases" className="story-back">
            ← Истории учеников
          </Link>

          <span className="case-track">{TRACK_LABEL[student.track]}</span>
          <h1 className="story-name">{student.name}</h1>
          <p className="story-headline">{student.headline}</p>

          <div className="story-body">
            {student.quote.map((paragraph, i) => (
              <p key={i}>{highlightStats(paragraph)}</p>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
