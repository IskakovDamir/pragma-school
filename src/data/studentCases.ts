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
 * `photo` is a path under public/ (e.g. "/students/name.webp"). Omit it when
 * there is no photo and the card falls back to initials in a circle.
 */
export type StudentCase = {
  name: string;
  role: string;
  /** One or more paragraphs, in the student's own words. */
  quote: string[];
  photo?: string;
  projectUrl?: string;
  projectLabel?: string;
};

export const STUDENT_CASES: StudentCase[] = [];
