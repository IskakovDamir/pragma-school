export function Free() {
  return (
    <section id="free" className="callout-band">
      <div className="wrap">
        <div className="callout reveal">
          <h2>Три бесплатных урока и полезные материалы</h2>
          <p
            style={{
              color: "var(--cream)",
              fontSize: "17px",
              lineHeight: 1.55,
              maxWidth: "560px",
              margin: "-14px auto 12px",
            }}
          >
            Посмотри как устроено обучение и собери свою первую маленькую автоматизацию без оплаты.
          </p>
          <p
            style={{
              color: "var(--cream)",
              fontFamily: "var(--mono)",
              fontSize: "13px",
              letterSpacing: "0.04em",
              margin: "0 auto 26px",
            }}
          >
            Пришлём на почту, доступ навсегда
          </p>
          {/* TODO: wire free-lessons form */}
          <a className="btn btn-primary" href="#">
            <span className="arrow">→</span> Забрать бесплатно
          </a>
        </div>
      </div>
    </section>
  );
}
