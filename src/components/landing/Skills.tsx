/**
 * НАВЫКИ — a static tag field on a full-bleed black band, in the slot the
 * deleted "Что собирают на курсе" section used to hold (between the hero and
 * the student cases).
 *
 * Deliberately inert: no .reveal, no marquee, no hover state, no transition.
 * These are labels, not controls, so nothing here may look or behave like
 * something you can press.
 *
 * The field is ONE wrapping flex row, not seven hand-cut rows. Wrapping is
 * what makes the right edge ragged for free at every width, and — the reason
 * it is not a choice — it is the only version that cannot push a pill past the
 * viewport edge. A cut pill would read as "this scrolls sideways", and nothing
 * here scrolls. The item ORDER is still authored, so the alternation below
 * survives whatever the browser does with the line breaks.
 */

type Item =
  | { kind: "pill"; label: string; tone: string }
  | { kind: "logo"; file: string; name: string; square?: boolean };

/** Gradient fill, white label. Ramp n maps to .sp-g{n} in styles.css. */
const grad = (label: string, ramp: number): Item => ({
  kind: "pill",
  label,
  tone: `sp-grad sp-g${ramp}`,
});

/** Same gradient family tinted toward white, so the label has to go dark. */
const tint = (label: string, ramp: number): Item => ({
  kind: "pill",
  label,
  tone: `sp-grad sp-light sp-l${ramp}`,
});

const solid = (label: string): Item => ({ kind: "pill", label, tone: "sp-solid" });
const line = (label: string): Item => ({ kind: "pill", label, tone: "sp-line" });

const logo = (file: string, name: string, square = false): Item => ({
  kind: "logo",
  file,
  name,
  square,
});

/**
 * Authored sequence. Two rules held it together, and both are worth keeping if
 * anyone reorders this:
 *
 *  1. No two pills of the same treatment are neighbours — gradient counts as
 *     one treatment, so a tinted pill never sits next to a saturated one.
 *  2. Nothing is grouped by topic or sorted. The mix is the point. Where a
 *     logo happens to land beside a related label (Kaspi by "сверка оплат",
 *     2GIS by "мониторинг отзывов") that is a bonus, not a scheme.
 *
 * Counts: 26 labels — 13 gradient (8 saturated, 5 tinted), 7 solid white,
 * 6 outline. 12 logo badges.
 */
const FIELD: Item[] = [
  grad("автоматизация", 1),
  logo("telegram", "Telegram"),
  solid("телеграм-боты"),
  line("ии-агенты"),
  grad("обработка документов", 2),

  solid("таблицы"),
  logo("google-sheets", "Google Sheets", true),
  grad("парсинг сайтов", 3),
  line("сверка оплат"),
  logo("kaspi", "Kaspi", true),
  tint("отчёты", 1),

  line("ответы клиентам"),
  logo("whatsapp", "WhatsApp"),
  grad("промпты", 4),
  solid("база знаний"),
  tint("вебхуки", 2),

  solid("интеграции"),
  grad("триггеры", 5),
  logo("slack", "Slack"),
  line("уведомления"),
  logo("instagram", "Instagram", true),
  solid("crm"),

  grad("голосовые агенты", 6),
  line("распознавание речи"),
  logo("notion", "Notion"),
  tint("рассылки", 3),
  logo("gmail", "Gmail"),
  solid("сценарии"),

  tint("напоминания", 4),
  logo("google-calendar", "Google Календарь", true),
  line("выгрузка данных"),
  logo("moy-sklad", "МойСклад"),
  grad("подсчёт остатков", 7),

  solid("мониторинг отзывов"),
  logo("2gis", "2ГИС"),
  grad("модерация заявок", 8),
  logo("bitrix24", "Битрикс24", true),
  tint("ассистент дня", 5),
];

export function Skills() {
  return (
    <section id="skills" className="skills-band">
      <div className="wrap">
        <div className="head-wrap skills-head">
          <p className="eyebrow">Навыки</p>
          <h2 className="h2">Чему ты научишься</h2>
        </div>
        <ul className="skills-field">
          {FIELD.map((item) =>
            item.kind === "pill" ? (
              <li key={item.label} className={`skill-pill ${item.tone}`}>
                {item.label}
              </li>
            ) : (
              <li key={item.file} className={`skill-logo${item.square ? " skill-logo-sq" : ""}`}>
                <img src={`/integrations/${item.file}.svg`} alt={item.name} loading="lazy" />
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
