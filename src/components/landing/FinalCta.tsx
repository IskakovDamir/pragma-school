/**
 * Pill tags. Both strings already appear on the page: the first is a hero
 * gutter tag, the second is this section's own reassure line. Nothing new is
 * claimed here.
 */
const FINAL_PILLS = ["уроки в записи", "Доступ сразу, без оплаты"];

export function FinalCta() {
  return (
    <section id="start" className="final">
      {/* Shared .hero-glow, kept. Only `top` is overridden, exactly as before —
          the hero's own rule is untouched. */}
      <div className="hero-glow" style={{ top: "-40px" }}></div>
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="final-inner">
          {/* aria-hidden: the second tag repeats the reassure line rendered
              directly below, and pointer-events are off so neither tag can
              intercept the CTA. */}
          <div className="final-pills" aria-hidden="true">
            {FINAL_PILLS.map((pill, i) => (
              <div key={pill} className={`final-pill-slot fp-${i + 1} reveal`} data-delay={i + 2}>
                <span className="final-pill">{pill}</span>
              </div>
            ))}
          </div>
          <div className="reveal">
            <h2 className="h2" style={{ fontSize: "clamp(34px,5.4vw,60px)" }}>
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
      </div>
    </section>
  );
}
