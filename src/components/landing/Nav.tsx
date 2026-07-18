import { useState } from "react";

const LINKS = [
  { href: "#tracks", label: "Курсы" },
  { href: "#how", label: "Как проходит" },
  { href: "#free", label: "Бесплатно" },
  { href: "#faq", label: "Вопросы" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const closePanel = () => setOpen(false);

  return (
    <>
      <div className="nav-shell">
        <nav className="nav" id="nav">
          <a className="logo" href="#">
            <img src="/pragma-logo.svg" alt="Pragma School" className="logo-img" />
            <span className="logo-word">Pragma School</span>
          </a>
          <div className="nav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav-cta">
            <a className="btn btn-outline" href="#">
              Войти
            </a>
            <a className="btn btn-primary btn-sm" href="#free">
              <span className="arrow">→</span> Начать
            </a>
            <button
              type="button"
              className="burger"
              id="burger"
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
            >
              <span></span>
            </button>
          </div>
        </nav>
      </div>
      <div className={`mobile-panel${open ? " open" : ""}`} id="mobilePanel">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={closePanel}>
            {l.label}
          </a>
        ))}
        <a className="btn btn-primary" href="#free" onClick={closePanel}>
          <span className="arrow">→</span> Начать
        </a>
      </div>
    </>
  );
}
