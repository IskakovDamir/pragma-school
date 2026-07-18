export function FinalCta() {
  return (
    <section id="start" className="final">
      <div className="hero-glow" style={{ top: "-40px" }}></div>
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="reveal">
          <h2 className="h2" style={{ fontSize: "clamp(34px,5.4vw,60px)" }}>
            Начни с трёх
            <br />
            бесплатных уроков
          </h2>
          <a className="btn btn-primary" href="#free">
            <span className="arrow">→</span> Забрать бесплатно
          </a>
          <p className="reassure">Пришлём на почту, доступ навсегда.</p>
        </div>
      </div>
    </section>
  );
}
