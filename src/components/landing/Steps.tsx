export function Steps() {
  return (
    <section id="how" className="block">
      <div className="wrap">
        <div className="head-wrap center reveal">
          <p className="eyebrow">Как проходит</p>
          <h2 className="h2">Три шага, знакомый ритм</h2>
          <p className="section-lead">
            От первого бесплатного урока до автоматизации, которая работает у тебя на работе.
          </p>
        </div>
        <div className="steps">
          <div className="steps-line">
            <svg
              viewBox="0 0 400 20"
              preserveAspectRatio="none"
              fill="none"
              stroke="#b6b6b6"
              strokeWidth="2"
              strokeDasharray="2 8"
              strokeLinecap="round"
            >
              <path d="M0 10 H400" />
            </svg>
          </div>
          <div className="step reveal" data-delay="1">
            <p className="step-num">01</p>
            <div className="step-dot">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C95100"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3>Начинаешь с бесплатных уроков</h3>
            <p>
              Получаешь три урока и материалы. Смотришь в своём темпе, пробуешь собрать что-то
              маленькое своими руками.
            </p>
          </div>
          <div className="step reveal" data-delay="2">
            <p className="step-num">02</p>
            <div className="step-dot">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C95100"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </div>
            <h3>Идёшь по программе</h3>
            <p>
              Выбираешь трек и проходишь курс с куратором. На каждом уроке разбираем понятный шаг и
              повторяем его на практике.
            </p>
          </div>
          <div className="step reveal" data-delay="3">
            <p className="step-num">03</p>
            <div className="step-dot">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C95100"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            </div>
            <h3>Применяешь у себя</h3>
            <p>
              К финалу у тебя своя автоматизация под свою задачу. Включаешь её в работу и она
              снимает часть рутины каждый день.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
