export function Free() {
  return (
    <section id="free" className="callout-band">
      <div className="wrap">
        <div className="callout reveal">
          <h2>Три бесплатных урока и полезные материалы</h2>
          {/* The inline styles these two carried existed only to force cream text
              onto the old orange slab. With the surface rebuilt they move to
              .callout-lead / .callout-note in the stylesheet. Copy unchanged. */}
          <p className="callout-lead">
            Посмотри как устроено обучение и собери свою первую маленькую автоматизацию без оплаты.
          </p>
          <p className="callout-note">Доступ сразу, без оплаты</p>
          <a
            className="btn btn-primary"
            href="https://pragme-edu.kz/app?course=teaser"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="arrow">→</span> Забрать бесплатно
          </a>
        </div>
      </div>
    </section>
  );
}
