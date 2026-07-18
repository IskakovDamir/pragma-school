import { useEffect } from "react";

/**
 * Mirrors the prototype's script.js: scroll-reveal IntersectionObserver,
 * nav condense on scroll, magnetic primary CTA, sketch parallax. Runs once
 * on mount after all landing sections have rendered so document queries
 * find every .reveal / .btn-primary / .sketch node. SSR-safe.
 */
export function useLandingBehavior() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Nav condense on scroll
    const nav = document.getElementById("nav");
    const onNavScroll = () => {
      if (!nav) return;
      if (window.scrollY > 20) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onNavScroll, { passive: true });
    onNavScroll();

    // Scroll reveal
    let io: IntersectionObserver | undefined;
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!reduce && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io!.unobserve(e.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
      );
      revealNodes.forEach((el) => io!.observe(el));
    } else {
      revealNodes.forEach((el) => el.classList.add("is-visible"));
    }

    // Magnetic primary CTAs (gentle, pointer-fine only)
    const magneticCleanups: Array<() => void> = [];
    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(".btn-primary").forEach((btn) => {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.18;
          const y = (e.clientY - r.top - r.height / 2) * 0.28;
          btn.style.transform = `translate(${x}px,${y}px)`;
        };
        const onLeave = () => {
          btn.style.transform = "";
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        magneticCleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
          btn.style.transform = "";
        });
      });
    }

    // Subtle parallax on hero sketches
    let onParallaxScroll: (() => void) | undefined;
    if (!reduce) {
      const sketches = Array.from(document.querySelectorAll<HTMLElement>(".sketch"));
      let ticking = false;
      onParallaxScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          sketches.forEach((s, i) => {
            const depth = (i % 2 === 0 ? 1 : -1) * (0.04 + i * 0.015);
            s.style.transform = `translateY(${y * depth}px)`;
          });
          ticking = false;
        });
      };
      window.addEventListener("scroll", onParallaxScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", onNavScroll);
      if (onParallaxScroll) window.removeEventListener("scroll", onParallaxScroll);
      io?.disconnect();
      magneticCleanups.forEach((fn) => fn());
    };
  }, []);
}
