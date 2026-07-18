export function Testimonial() {
  return (
    <section className="block">
      <div className="wrap">
        {/* PLACEHOLDER testimonial — replace with a real student quote */}
        <div className="quote-card reveal">
          <span className="qmark">{"\u201C"}</span>
          <blockquote>
            Начала с бесплатных уроков, потом взяла личный трек и собрала автоматизацию под свою
            работу. Теперь смотрю на задачи как на набор шагов, которые можно снять с себя.
          </blockquote>
          <div className="quote-author">
            <div className="quote-avatar">МК</div>
            <div className="quote-meta">
              <strong>Марина К.</strong>
              <span>Выпускница личного трека</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
