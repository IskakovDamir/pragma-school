export function Hero() {
  return (
    <header className="hero">
      <div className="hero-glow"></div>

      <div className="sketch s1">
        <svg
          viewBox="0 0 120 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 40 C20 12, 42 12, 56 34 S96 54, 116 22" />
        </svg>
      </div>
      <div className="sketch s2">
        <svg
          viewBox="0 0 130 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M10 80 C10 30, 60 6, 92 20" />
          <path d="M92 20 l-14 -2 M92 20 l-3 14" />
        </svg>
      </div>
      <div className="sketch s3">
        <svg
          viewBox="0 0 90 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M45 8 l9 24 25 2 -20 16 7 25 -21 -15 -21 15 7 -25 -20 -16 25 -2z" />
        </svg>
      </div>
      <div className="sketch s4">
        <svg
          viewBox="0 0 70 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M8 35 C8 12, 62 12, 62 35 S8 58, 8 35 Z" />
        </svg>
      </div>

      <div className="hero-inner">
        <span className="badge anim d1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
          </svg>
          Онлайн-школа автоматизации на ИИ
        </span>
        <h1 className="display">
          <span className="line anim d2">Собери свою первую</span>
          <span className="line anim d3">
            <span className="mark">автоматизацию</span> на ИИ
          </span>
        </h1>
        <p className="subhead anim d4">
          Учим собирать автоматизации на ИИ, которые снимают с тебя рутину. Начни с трёх бесплатных
          уроков и посмотри как это работает у тебя. Опыт в коде не нужен.
        </p>
        <div className="hero-cta anim d5">
          <a className="btn btn-primary" href="#free">
            <span className="arrow">→</span> Забрать 3 бесплатных урока
          </a>
          <a className="btn btn-mint" href="#tracks">
            Смотреть курсы
          </a>
        </div>
        <p className="reassure anim d6">Три урока и материалы. Без карты.</p>
      </div>
    </header>
  );
}
