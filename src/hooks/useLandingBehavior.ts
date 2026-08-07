import { useEffect } from "react";

/**
 * Mirrors the prototype's script.js: scroll-reveal IntersectionObserver,
 * nav condense on scroll, magnetic primary CTA, sketch parallax. Runs once on
 * mount. .reveal nodes no longer have to exist by then — a MutationObserver
 * hands late arrivals to the IntersectionObserver. .btn-primary and .sketch are
 * still one-shot document queries, so those two effects only cover nodes present
 * at mount. SSR-safe.
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

    // Scroll reveal. The IntersectionObserver can only see nodes that exist when
    // it is created, so a MutationObserver feeds it everything mounted later —
    // otherwise a lazily or conditionally rendered section sits at opacity: 0
    // forever. Same threshold, rootMargin, one-shot unobserve and .is-visible
    // class as before; the stagger still comes from data-delay in CSS.
    const io =
      !reduce && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, observer) => {
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  e.target.classList.add("is-visible");
                  observer.unobserve(e.target);
                }
              });
            },
            { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
          )
        : undefined;

    const trackReveal = (el: Element) => {
      // Already revealed: nothing to do. This guard also stops the .is-visible
      // write below from re-entering through the MutationObserver.
      if (el.classList.contains("is-visible")) return;
      // Reduced motion / no IntersectionObserver: reveal immediately, never hide.
      if (io) io.observe(el);
      else el.classList.add("is-visible");
    };

    const trackRevealsIn = (root: Element) => {
      if (root.classList.contains("reveal")) trackReveal(root);
      root.querySelectorAll<HTMLElement>(".reveal").forEach(trackReveal);
    };

    trackRevealsIn(document.body);

    const mo = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) trackRevealsIn(node as Element);
        });
        // Covers an existing node that gains .reveal from a class change.
        if (rec.type === "attributes" && rec.target.nodeType === Node.ELEMENT_NODE) {
          const target = rec.target as Element;
          if (target.classList.contains("reveal")) trackReveal(target);
        }
      }
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    // Magnetic primary CTAs (gentle, pointer-fine only)
    const magneticCleanups: Array<() => void> = [];
    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(".btn-primary").forEach((btn) => {
        // Written as custom properties, never as style.transform: .btn-primary
        // composes them with --btn-rot itself, so a rotation set in CSS survives
        // the magnetic offset instead of being overwritten. --btn-lift: 0 drops
        // the 2px hover lift while the cursor is driving the button, matching
        // the old behaviour where the inline transform replaced it outright.
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.18;
          const y = (e.clientY - r.top - r.height / 2) * 0.28;
          btn.style.setProperty("--btn-mx", `${x}px`);
          btn.style.setProperty("--btn-my", `${y}px`);
          btn.style.setProperty("--btn-lift", "0px");
        };
        const clear = () => {
          btn.style.removeProperty("--btn-mx");
          btn.style.removeProperty("--btn-my");
          btn.style.removeProperty("--btn-lift");
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", clear);
        magneticCleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", clear);
          clear();
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
      mo.disconnect();
      magneticCleanups.forEach((fn) => fn());
    };
  }, []);
}
