import type { ReactNode } from "react";

/**
 * The numbers a reader should catch while skimming a case. Alternatives are
 * ordered longest-form first, so the regex never settles for a prefix:
 *
 *   8:30                 a time — must beat the plain-number branch on "8"
 *   240 000              thousands grouped with a space (also NBSP / narrow NBSP)
 *   1,5%   12%   180     a decimal, a percent, a plain count
 */
const STAT_PATTERN = /\d+:\d{2}|\d{1,3}(?:[ \u00A0\u202F]\d{3})+(?:,\d+)?%?|\d+(?:,\d+)?%?/;

const LETTER = /\p{L}/u;

/**
 * Splits a case body into text and <span className="stat-highlight"> segments.
 *
 * Generic on purpose: nothing is marked up by hand in studentCases.ts, so a new
 * quote gets its numbers highlighted the moment it is pasted in — and a quote
 * with no numbers (Александр's) simply comes back as one plain string.
 *
 * Digits welded to letters are left alone: "n8n" is a tool this school teaches,
 * not a result, and highlighting the 8 inside it would be nonsense.
 */
export function highlightStats(text: string): ReactNode[] {
  // A fresh regex per call. STAT_PATTERN is shared and exec() advances
  // lastIndex, so reusing one /g instance would drop matches on the next card.
  const pattern = new RegExp(STAT_PATTERN.source, "g");
  const out: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    // ?? "" covers start === 0 and end === text.length, where the neighbour
    // is undefined rather than a character.
    const welded = LETTER.test(text[start - 1] ?? "") || LETTER.test(text[end] ?? "");
    if (welded) continue;

    if (start > cursor) out.push(text.slice(cursor, start));
    out.push(
      <span className="stat-highlight" key={start}>
        {match[0]}
      </span>,
    );
    cursor = end;
  }

  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}
