import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Skills } from "@/components/landing/Skills";
import { StudentCases } from "@/components/landing/StudentCases";
import { Tracks } from "@/components/landing/Tracks";
import { Steps } from "@/components/landing/Steps";
import { Free } from "@/components/landing/Free";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { useLandingBehavior } from "@/hooks/useLandingBehavior";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  /**
   * Canonical only. The root deliberately declares none (see __root.tsx), so the
   * homepage has to state its own like every other route. Everything else in the
   * head — title, description, og:*, icon, preconnects, styles — is the root's
   * and is correct here unchanged, so this head does not restate it.
   */
  head: () => ({
    links: [{ rel: "canonical", href: absoluteUrl() }],
  }),

  component: Index,
});

function Index() {
  useLandingBehavior();
  return (
    <>
      <Nav />
      <Hero />
      <Skills />
      <StudentCases />
      <Steps />
      <Tracks />
      <Free />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
