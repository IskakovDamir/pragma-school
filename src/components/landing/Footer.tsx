/**
 * Both columns point only at destinations that exist: the two live track
 * subdomains and in-page section anchors. The labels are the ones the nav and
 * the section eyebrows already use, so nothing here is newly written.
 *
 * Removed in this pass, because no destination exists for them and an `href="#"`
 * is a worse promise than an absent link: О нас, Блог, Контакты, Помощь, Гайды,
 * and the X / LinkedIn / YouTube icons. See the report for the full list.
 */
const COURSE_LINKS = [
  { href: "https://personal.edu.pragma.com.kz/", label: "Личный" },
  { href: "https://corporate.edu.pragma.com.kz/", label: "Корпоративный" },
  { href: "#free", label: "Бесплатные уроки" },
];

const SECTION_LINKS = [
  { href: "#how", label: "Как проходит" },
  { href: "#cases", label: "Истории учеников" },
  { href: "#faq", label: "Вопросы" },
];

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="logo" href="/">
              <img src="/pragma-logo.svg" alt="" className="logo-img" />
              <span className="logo-word">Pragma School</span>
            </a>
            <p>
              Онлайн-школа автоматизации на ИИ. Начни с трёх бесплатных уроков и посмотри как
              устроено обучение.
            </p>
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Курсы</p>
            {COURSE_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="foot-col">
            <p className="foot-col-title">Разделы</p>
            {SECTION_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <span>{"© 2026 Pragma School"}</span>
          <a className="foot-bottom-cta" href="#free">
            Забрать 3 бесплатных урока →
          </a>
        </div>
      </div>
    </footer>
  );
}
