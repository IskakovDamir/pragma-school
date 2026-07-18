import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Tracks } from "@/components/landing/Tracks";
import { Steps } from "@/components/landing/Steps";
import { Free } from "@/components/landing/Free";
import { Testimonial } from "@/components/landing/Testimonial";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { useLandingBehavior } from "@/hooks/useLandingBehavior";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useLandingBehavior();
  return (
    <>
      <Nav />
      <Hero />
      <Tracks />
      <Steps />
      <Free />
      <Testimonial />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
