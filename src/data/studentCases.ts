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
  /**
   * The ASCII segment this student's page lives at: /stories/<slug>.
   *
   * ASCII, and deliberately so. Cyrillic in a URL path is a liability for the
   * same reason it was a liability as a filename: "Айсулу" has two byte
   * representations, composed (NFC: й) and decomposed (NFD: и + combining
   * breve), and they are different strings. macOS handed us NFD filenames while
   * a literal typed into this file is NFC, so the request missed the file on
   * disk and 404'd — on exactly the two names containing "й", which is the kind
   * of half-broken that ships. A path segment is worse than a filename: it also
   * gets percent-encoded, pasted into chats, and normalised by whatever is in
   * between. ASCII cannot be normalised into a different byte string.
   *
   * Slugs match the WebP basenames in public/students/ so the two cannot drift.
   */
  slug: string;
  name: string;
  /** Which of the two tracks this student took — shown as the card's badge. */
  track: StudentTrack;
  /** What they automated, in one line. The card's heading. */
  headline: string;
  /**
   * Optional job title. Rendered on the detail page under the name, and
   * deliberately NOT on the card, which has no room for a second line in the
   * portrait's name band.
   *
   * This used to be described as redundant, on the grounds that the headlines
   * carried the profession themselves — "Юрист строительной компании, проверка
   * договоров подряда". They no longer do: shortening them to "Проверка
   * договоров" dropped the job, and this field is where it went back.
   *
   * Optional because it is genuinely unknown for some students, not as a
   * placeholder to fill in later. Айсулу and Александр stated no profession in
   * the source material, so they have none here — the same rule as every other
   * field in this file, nothing that was not actually said.
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
  /**
   * Head-scale normalisation. The card renders every portrait at
   * `--case-photo-unit * photoScale` tall, and slides it so that
   * `--case-photo-unit * photoEye` from the image's top lands on the card's
   * shared eye line. Together they put the five faces at the same size and on
   * the same horizon.
   *
   * This exists because the five crops are wildly inconsistent as SHOT, and
   * fitting each one independently — which is what the card used to do, with a
   * single max-height — is what made the row look wrong. Measured against each
   * portrait's own frame height: Александр's face fills ~31% of his frame and
   * Айсулу's ~10%, so a shared max-height rendered his head close to twice the
   * size of hers. No amount of colour fixes that; it is the first thing the eye
   * catches when the five are seen side by side.
   *
   * photoScale is proportional to (frame height / face height), normalised so
   * the largest is 1. photoEye is the eye line's depth into the frame as a
   * fraction, times photoScale — precomputed here because CSS cannot multiply
   * two custom properties into a length cleanly.
   *
   * Derived from the cutouts themselves, not from the numbers above: alpha
   * silhouette analysis finds the shoulder line reliably on the three short
   * haircuts and not at all on Айсулу and Айнур, whose hair merges into the
   * body, so the face landmarks were read off a gridded render of each frame
   * and then confirmed by eye against the five rendered side by side. Re-crop
   * a portrait and both numbers have to be re-measured — nothing derives them
   * at build time.
   */
  photoScale?: number;
  photoEye?: number;
  /**
   * Where this portrait starts fading out, as a percentage of its own rendered
   * height. Defaults to 80 in CSS; set it lower only when the cutout contains
   * something that is not the person.
   *
   * Two of the five do. Айсулу was photographed behind a laptop and Айнур with
   * her hands on a keyboard, and both objects came away in the cutout. On the
   * old pale wash they were unremarkable; on a saturated fill they read as
   * grey ghosts floating on the colour. Fading each portrait out above its own
   * furniture removes them without touching the other three, and without
   * re-cropping source files that are otherwise fine.
   */
  photoFade?: number;
  projectUrl?: string;
  projectLabel?: string;
};

/**
 * Adding an entry here also creates a page at /stories/<slug>. public/sitemap.xml
 * is hand-maintained and will NOT pick it up — add the matching <url> there too,
 * or the page ships with a correct canonical that nothing ever points a crawler
 * at. Nothing in the build catches this.
 */
export const STUDENT_CASES: StudentCase[] = [
  {
    slug: "aisulu",
    name: "Айсулу",
    track: "personal",
    headline: "Поиск квартиры",
    teaser: "Подходящие объявления приходят в чат через 3 минуты после публикации.",
    quote: [
      "Я искала квартиру в аренду и постоянно опаздывала: хорошие варианты разбирали в течение часа, а я узнавала о них вечером, после работы.",
      "Настроила систему, которая круглосуточно отслеживает объявления, отсеивает по району, этажу и цене и присылает подходящее прямо в чат через 3 минуты после публикации.",
      "За неделю у меня было 6 приглашений на просмотр, и 4 из них пришли по объявлениям младше 20 минут.",
    ],
    photo: "/students/aisulu.webp",
    photoWidth: 300,
    photoHeight: 401,
    photoScale: 0.842,
    photoEye: 0.149,
    photoFade: 50, // laptop starts ~71% down; gone by 70%
  },
  {
    slug: "dulat",
    name: "Дулат",
    track: "corporate",
    role: "Юрист строительной компании",
    headline: "Проверка договоров",
    teaser:
      "Агент сверяет договор с шаблоном и выдаёт расхождения по пунктам. 40 минут превратились в 6.",
    quote: [
      "На проверку одного договора подряда у меня уходило 40 минут: сверить пункты с шаблоном компании и найти расхождения.",
      "Собрал агента, который делает это сам и выдаёт список расхождений с номерами пунктов. Модель развёрнута на сервере компании, тексты договоров не покидают периметр, и без этого условия служба безопасности проект бы не согласовала.",
      "Сейчас проверка занимает 6 минут, а за первый месяц через агента прошло 180 договоров.",
    ],
    photo: "/students/dulat.webp",
    photoWidth: 426,
    photoHeight: 462,
    photoScale: 0.549,
    photoEye: 0.092,
  },
  {
    slug: "maksim",
    name: "Максим",
    track: "corporate",
    role: "Владелец интернет-магазина",
    headline: "Заказы с маркетплейсов",
    teaser:
      "Три площадки сходятся в одну таблицу, склад получает задание сам. Просрочка упала с 12% до 1,5%.",
    quote: [
      "Просрочка отгрузки доходила до 12%, и штрафы площадок съедали часть прибыли месяца.",
      "Настроил систему, которая собирает заказы с трёх площадок в одну таблицу, обновляет статусы каждые 15 минут и отправляет складу задание на сборку без моего участия. Она работает и в выходные, и в 4 утра.",
      "Просрочка упала до 1,5%, а штрафы за месяц снизились на 240 000 тенге.",
    ],
    photo: "/students/maksim.webp",
    photoWidth: 323,
    photoHeight: 487,
    photoScale: 0.779,
    photoEye: 0.16,
  },
  {
    slug: "ainur",
    name: "Айнур",
    track: "corporate",
    role: "Собственник сети кофеен",
    headline: "Сводка по кофейням",
    teaser:
      "Каждое утро в 8:30 приходит одно сообщение: выручка по каждой точке и отклонение от плана.",
    quote: [
      "Раньше я узнавала цифры по точкам от управляющих и получала их только к обеду четверга.",
      "Теперь каждый день в 8:30 приходит одно сообщение: выручка по каждой точке, отклонение от плана и списания. Данные из кассовой системы никуда не выгружаются, вся обработка идёт внутри.",
      "Провал по одной из точек я вижу уже на третий день, и за счёт этого получилось вернуть около 900 000 тенге месячной выручки.",
    ],
    photo: "/students/ainur.webp",
    photoWidth: 433,
    photoHeight: 524,
    photoScale: 0.86,
    photoEye: 0.142,
    photoFade: 48, // arm reaches for the keyboard ~69% down; gone by 68%
  },
  {
    slug: "aleksandr",
    name: "Александр",
    track: "personal",
    headline: "Родительская логистика",
    teaser: "Расписание детей и сроки оплат в одном календаре. За 6 месяцев ни одной просрочки.",
    quote: [
      "Раньше я держал в голове расписание кружков, дни рождения одноклассников, сроки оплаты и медосмотров, и дважды в итоге платил пеню за просрочку.",
      "Собрал календарь, который сводит всё это в одном месте и присылает напоминание заранее, за нужное количество дней.",
      "За полгода не пропустил ни одной оплаты.",
    ],
    photo: "/students/aleksandr.webp",
    photoWidth: 335,
    photoHeight: 555,
    photoScale: 0.581,
    photoEye: 0.167,
  },
];

/**
 * The route resolves a student through here rather than reaching into the array
 * itself, so the "unknown slug" case has exactly one shape for the caller to
 * handle and the array stays an implementation detail.
 */
export function getStudentBySlug(slug: string): StudentCase | undefined {
  return STUDENT_CASES.find((student) => student.slug === slug);
}

/**
 * The stories either side of `slug` in this array's order, wrapping at both
 * ends: the last leads to the first and the first leads back to the last.
 *
 * Wrapping rather than clamping because there are only five. The rail's arrows
 * clamp and disable at the ends, which is right for a scroller whose extent the
 * reader can see; a link that is simply absent at the end of a page reads as a
 * dead end instead. Wrapping costs at most four steps to see all five and never
 * leaves a page with one way out.
 *
 * Returns undefined for an unknown slug rather than guessing a pair. The route
 * never asks with one, since its loader has already thrown notFound().
 */
export function getStudentNeighbours(
  slug: string,
): { prev: StudentCase; next: StudentCase } | undefined {
  const i = STUDENT_CASES.findIndex((student) => student.slug === slug);
  if (i === -1) return undefined;

  const n = STUDENT_CASES.length;
  // + n before the modulo: (0 - 1) % 5 is -1 in JS, not 4.
  return {
    prev: STUDENT_CASES[(i - 1 + n) % n],
    next: STUDENT_CASES[(i + 1) % n],
  };
}
