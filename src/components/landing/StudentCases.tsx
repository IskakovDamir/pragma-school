{/* PLACEHOLDER student cases — replace photos (public/students/) and text with real ones */}
import { useState } from "react";

type Case = {
  name: string;
  role: string;
  initials: string;
  quote: string;
};

const CASES: Case[] = [
  {
    name: "Арман Т.",
    role: "Маркетолог",
    initials: "АТ",
    quote:
      "Пришёл без технического бэкграунда и думал, что автоматизации это сложно и точно не про меня. К концу собрал бота, который сам собирает заявки из инсты и складывает их в таблицу. Больше не трачу вечера на ручной перенос данных, всё падает само.",
  },
  {
    name: "Дана К.",
    role: "Владелица небольшого агентства",
    initials: "ДК",
    quote:
      "Мы тонули в рутине: отчёты, напоминания клиентам, выгрузки. На курсе я разобралась, как связать наши инструменты между собой, и собрала первую рабочую цепочку прямо по своей задаче. Наставник разобрал её и показал, где упростить.",
  },
  {
    name: "Ержан С.",
    role: "Аналитик",
    initials: "ЕС",
    quote:
      "Больше всего зашло, что учат на живых кейсах. Я взял свою реальную задачу с еженедельным отчётом и автоматизировал её за время курса. То, на что уходил целый день, теперь готовится само к утру понедельника.",
  },
  {
    name: "Мадина А.",
    role: "Фрилансер",
    initials: "МА",
    quote:
      "Хотела просто попробовать бесплатные уроки и осталась на полный курс. Теперь беру заказы на автоматизацию, хотя год назад даже не знала, что так можно зарабатывать. Готовые проекты с курса сразу пошли в портфолио.",
  },
  {
    name: "Тимур Б.",
    role: "Операционный менеджер",
    initials: "ТБ",
    quote:
      "У нас в компании куча повторяющихся действий, и я давно хотел это разгрести. Разобрался, как собрать агента, который сам обрабатывает входящие обращения и отвечает по шаблону. Команда разгрузилась, а меня заметило руководство.",
  },
];

export function StudentCases() {
  const [index, setIndex] = useState(0);
  const total = CASES.length;
  const current = CASES[index];

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section id="cases" className="block">
      <div className="wrap">
        <div className="head-wrap center reveal">
          <div className="eyebrow">Результаты</div>
          <h2 className="h2">Истории наших учеников</h2>
          <p className="section-lead">
            Реальные задачи, которые они закрыли автоматизацией.
          </p>
        </div>

        <div className="cases">
          <article className="case-card">
            {/* Real photos will live in public/students/. When ready, swap
                the div below for <img class="case-photo-img" ... /> */}
            <div className="case-photo" aria-hidden="true">
              <span className="case-photo-initials">{current.initials}</span>
            </div>
            <div className="case-body">
              <p className="case-quote">{current.quote}</p>
              <div className="case-meta">
                <strong className="case-name">{current.name}</strong>
                <span className="case-role">{current.role}</span>
              </div>
            </div>
          </article>

          <div className="cases-controls">
            <button
              type="button"
              className="case-arrow"
              aria-label="Предыдущая история"
              onClick={prev}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="cases-counter">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="case-arrow"
              aria-label="Следующая история"
              onClick={next}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
