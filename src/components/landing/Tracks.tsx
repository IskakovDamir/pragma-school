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

function LogoCluster({ files }: { files: string[] }) {
  return (
    <div className="track-logos" aria-hidden="true">
      {files.map((file, i) => (
        <img
          key={file}
          src={`/integrations/${file}`}
          alt=""
          className="track-logo"
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
          <a
            className="track-card reveal"
            data-delay="1"
            href="https://personal.edu.pragma.com.kz/"
          >
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
          <a
            className="track-card reveal"
            data-delay="2"
            href="https://corporate.edu.pragma.com.kz/"
          >
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
    </section>
  );
}
