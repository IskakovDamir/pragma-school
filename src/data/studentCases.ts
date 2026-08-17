/**
 * Student cases shown in the "Истории наших учеников" section.
 *
 * REAL STUDENTS ONLY. Every entry in this array must be a real person who has
 * agreed to be named and quoted on a public page. Nothing goes in this file
 * that was not actually said by that person:
 *
 *   - no invented students, and no "representative" or composite people
 *     assembled from several real ones
 *   - no quotes written or paraphrased on a student's behalf
 *   - no placeholder or sample entries, not even temporarily — a placeholder
 *     that looks plausible is indistinguishable from a fake testimonial once
 *     it ships
 *   - no results, numbers or job titles that have not been confirmed
 *
 * The section heading claims real results, so an unverified entry here is a
 * false claim on the live site. While this array is empty the section renders
 * nothing at all, which is the correct state until real quotes exist.
 *
 * `photo` is a path under public/ (e.g. "/students/aisulu.webp"). Omit it when
 * there is no photo and the card falls back to initials in a circle. The app
 * loads WebP; the source PNGs live in assets/students-src/, outside public/ so
 * the build does not ship files nothing requests. That folder's README carries
 * the cwebp invocation and the crops already baked into each file.
 *
 * Two things about those files are load-bearing:
 *
 *   - The names are transliterated, not Cyrillic. macOS stores "Айсулу.png"
 *     decomposed (NFD: и + combining breve), while a filename typed into this
 *     file is composed (NFC: й) — the request then misses the file on disk and
 *     404s. It bit exactly the two names containing "й" and left the other
 *     three working, which is the kind of half-broken that reaches production.
 *     ASCII names cannot be normalised into a different byte string.
 *   - They are cropped tight to the subject. The portrait breaks the top edge
 *     of the card's photo block, and that only lands on the same line for every
 *     student if none of them carries transparent padding above the head.
 */

/** The two courses offered on this page, matching the <h3>s in Tracks.tsx. */
export type StudentTrack = "personal" | "corporate";

export const TRACK_LABEL: Record<StudentTrack, string> = {
  personal: "Личный",
  corporate: "Корпоративный",
};

export type StudentCase = {
  name: string;
  /** Which of the two tracks this student took — shown as the card's badge. */
  track: StudentTrack;
  /** What they automated, in one line. The card's heading. */
  headline: string;
  /**
   * Optional job title under the name. Most headlines already carry the role
   * ("Юрист строительной компании, …"), so this stays empty unless a student
   * has one worth stating separately.
   */
  role?: string;
  /** Two or three lines. This is what the card shows. */
  teaser: string;
  /**
   * One or more paragraphs, in the student's own words. Not rendered on the
   * card — reserved as the source for the detail page.
   */
  quote: string[];
  photo?: string;
  /**
   * Intrinsic pixel size of `photo`. Passed straight to the <img> so the card
   * reserves a box of the right shape before the file arrives — the five
   * portraits have five different ratios, so one shared pair would guarantee a
   * layout shift on four of them. Verified against naturalWidth/naturalHeight.
   */
  photoWidth?: number;
  photoHeight?: number;
  projectUrl?: string;
  projectLabel?: string;
};

export const STUDENT_CASES: StudentCase[] = [
  {
    name: "Айсулу",
    track: "personal",
    headline: "Поиск квартиры",
    teaser: "Подходящие объявления приходят в чат через 3 минуты после публикации.",
    quote: [
      "Я искала квартиру в аренду и постоянно опаздывала: хорошие варианты разбирали в течение часа, а я узнавала о них вечером, после работы. Настроила систему, которая круглосуточно отслеживает объявления, отсеивает по району, этажу и цене и присылает подходящее прямо в чат через 3 минуты после публикации. За неделю у меня было 6 приглашений на просмотр, и 4 из них пришли по объявлениям младше 20 минут.",
    ],
    photo: "/students/aisulu.webp",
    photoWidth: 300,
    photoHeight: 401,
  },
  {
    name: "Дулат",
    track: "corporate",
    headline: "Проверка договоров",
    teaser:
      "Агент сверяет договор с шаблоном и выдаёт расхождения по пунктам. 40 минут превратились в 6.",
    quote: [
      "На проверку одного договора подряда у меня уходило 40 минут: сверить пункты с шаблоном компании и найти расхождения. Собрал агента, который делает это сам и выдаёт список расхождений с номерами пунктов. Модель развёрнута на сервере компании, тексты договоров не покидают периметр, и без этого условия служба безопасности проект бы не согласовала. Сейчас проверка занимает 6 минут, а за первый месяц через агента прошло 180 договоров.",
    ],
    photo: "/students/dulat.webp",
    photoWidth: 426,
    photoHeight: 462,
  },
  {
    name: "Максим",
    track: "corporate",
    headline: "Заказы с маркетплейсов",
    teaser:
      "Три площадки сходятся в одну таблицу, склад получает задание сам. Просрочка упала с 12% до 1,5%.",
    quote: [
      "Просрочка отгрузки доходила до 12%, и штрафы площадок съедали часть прибыли месяца. Настроил систему, которая собирает заказы с трёх площадок в одну таблицу, обновляет статусы каждые 15 минут и отправляет складу задание на сборку без моего участия. Она работает и в выходные, и в 4 утра. Просрочка упала до 1,5%, а штрафы за месяц снизились на 240 000 тенге.",
    ],
    photo: "/students/maksim.webp",
    photoWidth: 323,
    photoHeight: 487,
  },
  {
    name: "Айнур",
    track: "corporate",
    headline: "Сводка по кофейням",
    teaser:
      "Каждое утро в 8:30 приходит одно сообщение: выручка по каждой точке и отклонение от плана.",
    quote: [
      "Раньше я узнавала цифры по точкам от управляющих и получала их только к обеду четверга. Теперь каждый день в 8:30 приходит одно сообщение: выручка по каждой точке, отклонение от плана и списания. Данные из кассовой системы никуда не выгружаются, вся обработка идёт внутри. Провал по одной из точек я вижу уже на третий день, и за счёт этого получилось вернуть около 900 000 тенге месячной выручки.",
    ],
    photo: "/students/ainur.webp",
    photoWidth: 433,
    photoHeight: 524,
  },
  {
    name: "Александр",
    track: "personal",
    headline: "Родительская логистика",
    teaser: "Расписание детей и сроки оплат в одном календаре. За 6 месяцев ни одной просрочки.",
    quote: [
      "Раньше я держал в голове расписание кружков, дни рождения одноклассников, сроки оплаты и медосмотров, и дважды в итоге платил пеню за просрочку. Собрал календарь, который сводит всё это в одном месте и присылает напоминание заранее, за нужное количество дней. За полгода не пропустил ни одной оплаты.",
    ],
    photo: "/students/aleksandr.webp",
    photoWidth: 335,
    photoHeight: 555,
  },
];
