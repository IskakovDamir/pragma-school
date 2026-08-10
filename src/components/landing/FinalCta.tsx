export function FinalCta() {
  return (
    <section id="start" className="final">
      {/* Shared .hero-glow, kept. Only `top` is overridden — the hero's own rule
          is untouched. */}
      <div className="hero-glow" style={{ top: "-40px" }}></div>
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        {/* The two floating pill tags that used to sit here are gone. This is
            440px of section around a single button, and they were the only
            elements competing with the CTA at the moment of decision; one of
            them ("уроки в записи") also duplicated a hero tag verbatim, and the
            other repeated the reassure line rendered directly below it. */}
        <div className="reveal">
          <h2 className="h2">
            Начни с трёх
            <br />
            бесплатных уроков
          </h2>
          {/* Straight to the teaser. This used to point at #free, which scrolled
              the reader down to a block holding an identical button — a click
              that bought nothing. */}
          <a
            className="btn btn-primary"
            href="https://pragme-edu.kz/app?course=teaser"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="arrow">→</span> Забрать бесплатно
          </a>
          {/* Was "Доступ сразу, без оплаты", which also renders in the Free
              block where the offer is actually explained. This is the hero's
              own reassure line, verbatim — not a new claim. */}
          <p className="reassure">Три урока и материалы. Без карты.</p>
        </div>
      </div>
    </section>
  );
}
