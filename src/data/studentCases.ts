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
 * `photo` is a path under public/ (e.g. "/students/aisulu.png"). Omit it when
 * there is no photo and the card falls back to initials in a circle.
 *
 * Two things about those files are load-bearing:
 *
 *   - The names are transliterated, not Cyrillic. macOS stores "Айсулу.png"
 *     decomposed (NFD: и + combining breve), while a filename typed into this
 *     file is composed (NFC: й) — the request then misses the file on disk and
 *     404s. It bit exactly the two names containing "й" and left the other
 *     three working, which is the kind of half-broken that reaches production.
 *     ASCII names cannot be normalised into a different byte string.
 *   - They are cropped tight to the subject. The card lets the portrait break
 *     its top edge, and that only lands on the same line for every student if
 *     none of them carries transparent padding above the head.
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
  /** One or more paragraphs, in the student's own words. */
  quote: string[];
  photo?: string;
  projectUrl?: string;
  projectLabel?: string;
};

export const STUDENT_CASES: StudentCase[] = [
  {
    name: "Айсулу",
    track: "personal",
    headline: "Поиск квартиры в аренду",
    quote: [
      "Я искала квартиру в аренду и постоянно опаздывала: хорошие варианты разбирали в течение часа, а я узнавала о них вечером, после работы. Настроила систему, которая круглосуточно отслеживает объявления, отсеивает по району, этажу и цене и присылает подходящее прямо в чат через 3 минуты после публикации. За неделю у меня было 6 приглашений на просмотр, и 4 из них пришли по объявлениям младше 20 минут.",
    ],
    photo: "/students/aisulu.png",
  },
  {
    name: "Дулат",
    track: "corporate",
    headline: "Юрист строительной компании, проверка договоров подряда",
    quote: [
      "На проверку одного договора подряда у меня уходило 40 минут: сверить пункты с шаблоном компании и найти расхождения. Собрал агента, который делает это сам и выдаёт список расхождений с номерами пунктов. Модель развёрнута на сервере компании, тексты договоров не покидают периметр, и без этого условия служба безопасности проект бы не согласовала. Сейчас проверка занимает 6 минут, а за первый месяц через агента прошло 180 договоров.",
    ],
    photo: "/students/dulat.png",
  },
  {
    name: "Максим",
    track: "corporate",
    headline: "Интернет-магазин, заказы с маркетплейсов",
    quote: [
      "Просрочка отгрузки доходила до 12%, и штрафы площадок съедали часть прибыли месяца. Настроил систему, которая собирает заказы с трёх площадок в одну таблицу, обновляет статусы каждые 15 минут и отправляет складу задание на сборку без моего участия. Она работает и в выходные, и в 4 утра. Просрочка упала до 1,5%, а штрафы за месяц снизились на 240 000 тенге.",
    ],
    photo: "/students/maksim.png",
  },
  {
    name: "Айнур",
    track: "corporate",
    headline: "Сеть кофеен, утренняя сводка по точкам",
    quote: [
      "Раньше я узнавала цифры по точкам от управляющих и получала их только к обеду четверга. Теперь каждый день в 8:30 приходит одно сообщение: выручка по каждой точке, отклонение от плана и списания. Данные из кассовой системы никуда не выгружаются, вся обработка идёт внутри. Провал по одной из точек я вижу уже на третий день, и за счёт этого получилось вернуть около 900 000 тенге месячной выручки.",
    ],
    photo: "/students/ainur.png",
  },
  {
    name: "Александр",
    track: "personal",
    headline: "Родительская логистика",
    quote: [
      "Раньше я держал в голове расписание кружков, дни рождения одноклассников, сроки оплаты и медосмотров, и дважды в итоге платил пеню за просрочку. Собрал календарь, который сводит всё это в одном месте и присылает напоминание заранее, за нужное количество дней. За полгода не пропустил ни одной оплаты.",
    ],
    photo: "/students/aleksandr.png",
  },
];
