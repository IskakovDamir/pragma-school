export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="logo" href="#">
              <img src="/pragma-logo.svg" alt="Pragma School" className="logo-img" />
              <span className="logo-word">Pragma School</span>
            </a>
            <p>
              Онлайн-школа автоматизации на ИИ. Начни с трёх бесплатных уроков и посмотри как
              устроено обучение.
            </p>
            <div className="news">
              <input type="email" placeholder="ты@почта.ру" aria-label="Почта" />
              <button type="button" className="btn btn-primary btn-sm">
                Подписаться
              </button>
            </div>
          </div>
          <div className="foot-col">
            <h4>Курсы</h4>
            <a href="https://personal.edu.pragma.com.kz/">Личный</a>
            <a href="https://corporate.edu.pragma.com.kz/">Корпоративный</a>
            <a href="#free">Бесплатные уроки</a>
          </div>
          <div className="foot-col">
            <h4>Школа</h4>
            <a href="#">О нас</a>
            <a href="#">Блог</a>
            <a href="#">Контакты</a>
          </div>
          <div className="foot-col">
            <h4>Ресурсы</h4>
            <a href="#">Помощь</a>
            <a href="#">Гайды</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{"\u00A9 2026 Pragma School"}</span>
          <div className="foot-socials">
            <a href="#" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5-6.6L5.4 22H2.2l8.2-9.4L1.6 2h6.9l4.5 6zM17.7 20h1.7L7 4H5.2z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.2 8h4.6v12H.2zM8 8h4.4v1.6h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.5 3 5.5 6.9V20h-4.6v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H8z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12zM9.8 15.3V8.7l5.7 3.3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
