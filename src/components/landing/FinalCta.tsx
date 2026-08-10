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
          <a className="btn btn-primary" href="#free">
            <span className="arrow">→</span> Забрать бесплатно
          </a>
          <p className="reassure">Доступ сразу, без оплаты</p>
        </div>
      </div>
    </section>
  );
}
