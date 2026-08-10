const PERSONAL_LOGOS = [
  "gmail.svg",
  "telegram.svg",
  "notion.svg",
  "google-sheets.svg",
  "whatsapp.svg",
];

const CORPORATE_LOGOS = [
  "slack.svg",
  "microsoft-teams.svg",
  "amocrm.svg",
  "bitrix24.svg",
  "google-cloud.svg",
];

/**
 * Floating tags. Every string is lifted verbatim from a <li> already rendered
 * below — nothing new is claimed here. Order matters: the tag sits over the
 * card it came from, so the two personal-track phrases go left and centre and
 * the corporate one goes right.
 */
const TRACK_PILLS = [
  "Куратор в личном чате",
  "Свой рабочий проект к финалу",
  "Практика на ваших задачах",
];

function LogoCluster({ files }: { files: string[] }) {
  return (
    <div className="track-logos" aria-hidden="true">
      {files.map((file, i) => (
        <img
          key={file}
          src={`/integrations/${file}`}
          alt=""
          className="track-logo"
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </div>
  );
}

export function Tracks() {
  return (
    <section id="tracks" className="block">
      <div className="wrap">
        <div className="head-wrap reveal">
          <p className="eyebrow">Курсы</p>
          <h2 className="h2">Два трека под твой формат</h2>
          <p className="section-lead">
            Один курс для себя, другой для всей команды. Оба ведут в одно и то же: рабочую
            автоматизацию, которая живёт у тебя после курса.
          </p>
        </div>
        <div className="tracks">
          {/* aria-hidden: these repeat list items rendered a few lines below,
              and pointer-events are off so they never intercept a card link. */}
          <div className="track-pills" aria-hidden="true">
            {TRACK_PILLS.map((pill, i) => (
              <div key={pill} className={`track-pill-slot tp-${i + 1} reveal`} data-delay={i + 3}>
                <span className="track-pill">{pill}</span>
              </div>
            ))}
          </div>
          {/* .reveal lives on the wrapper, never on the rotated card:
              .reveal.is-visible sets transform: translateY(0) at (0,2,0), which
              outranks .track-card and silently flattens the rotation. Same
              slot/card split as the hero's pills and the step cards. */}
          <div className="track-wrap reveal" data-delay="1">
            <a className="track-card tk-1" href="https://personal.edu.pragma.com.kz/">
              <p className="track-eyebrow">Для себя</p>
              <h3>Личный</h3>
              <p>
                Подходит если хочешь ускорить свою работу, взять больше проектов или собирать
                автоматизации на заказ.
              </p>
              <ul>
                <li>Живые эфиры и записи на весь курс</li>
                <li>Куратор в личном чате</li>
                <li>Свой рабочий проект к финалу</li>
              </ul>
              <div className="track-foot">
                <span className="track-cta">Открыть трек →</span>
                <LogoCluster files={PERSONAL_LOGOS} />
              </div>
            </a>
          </div>
          <div className="track-wrap reveal" data-delay="2">
            <a className="track-card tk-2" href="https://corporate.edu.pragma.com.kz/">
              <p className="track-eyebrow">Для команды</p>
              <h3>Корпоративный</h3>
              <p>
                Учим твою команду под ваши задачи. Разбираем сценарии, где автоматизация даст самую
                заметную отдачу в ваших процессах.
              </p>
              <ul>
                <li>Программа под ваши процессы</li>
                <li>Практика на ваших задачах</li>
                <li>Отдельный чат для команды</li>
              </ul>
              <div className="track-foot">
                <span className="track-cta">Открыть трек →</span>
                <LogoCluster files={CORPORATE_LOGOS} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
