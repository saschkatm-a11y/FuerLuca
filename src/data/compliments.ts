export const compliments = [
  "Zoey, du bist wunderschön – aber das Schönste an dir ist die Art, wie du die Welt für andere heller machst.",
  "Dein Lächeln kann selbst einen schlechten Tag besser machen.",
  "Bei dir fühlt sich selbst ein ganz normaler Moment besonders an.",
  "Du bist nicht nur wunderschön, sondern auch unglaublich liebenswert.",
  "Deine Art ist einer der Gründe, warum ich jeden Tag dankbar bin.",
  "Du schaffst es, dass sich Nähe wie Zuhause anfühlt.",
  "Du bist stärker, als du manchmal selbst glaubst.",
  "Ich liebe es, wie du lachst.",
  "Du machst mein Leben bunter.",
  "Mit dir möchte ich noch unendlich viele Erinnerungen sammeln.",
  "Du bist mein Lieblingsmensch.",
  "Deine Augen haben etwas, in dem ich mich jedes Mal verlieren könnte.",
  "Du bist auf deine ganz eigene Art perfekt.",
  "Ich bewundere, wie viel Wärme du anderen Menschen gibst.",
  "Neben dir fühlt sich alles ein bisschen leichter an.",
  "Du bist das schönste Kapitel in meiner Geschichte.",
  "Ich könnte dir stundenlang zuhören.",
  "Du bist gleichzeitig mein Ruheort und mein größtes Abenteuer.",
  "Die Welt ist schöner, weil es dich gibt.",
  "Ich würde mich immer wieder für dich entscheiden.",
  "Du bist viel besonderer, als Worte jemals erklären könnten.",
  "Jeder Moment mit dir ist eine Erinnerung, die ich behalten möchte.",
  "Du bringst mein Herz auf die schönste Art durcheinander.",
  "Selbst deine kleinen Eigenheiten machen dich für mich noch besonderer.",
  "Bei dir muss ich mich nicht verstellen.",
  "Du bist einer meiner schönsten Gründe, glücklich zu sein.",
] as const;

export type Compliment = (typeof compliments)[number];

export const complimentMilestones = {
  5: "Du hast schon fünf Gründe entdeckt, warum du besonders bist. Dabei gibt es noch viel mehr. ✨",
  10: "Achievement freigeschaltet: Komplimente-Sammlerin 💌",
  20: "Geheimnis entdeckt: Ich könnte diese Liste für immer weiterschreiben.",
} as const;

export type ComplimentMilestoneCount = keyof typeof complimentMilestones;

export const allComplimentsMessage =
  "Du hast alle Komplimente entdeckt. Aber ehrlich gesagt reichen selbst diese nicht aus, um dich zu beschreiben. 💗";

/** Returns only a newly reached milestone, rather than repeating older rewards. */
export function getComplimentMilestone(
  discoveredCount: number,
  total = compliments.length,
): string | null {
  if (discoveredCount >= total) {
    return allComplimentsMessage;
  }

  if (discoveredCount in complimentMilestones) {
    return complimentMilestones[
      discoveredCount as ComplimentMilestoneCount
    ];
  }

  return null;
}

export function formatComplimentCount(count: number): string {
  return count === 1
    ? "1 liebes Wort für Zoey entdeckt"
    : `${count} liebe Worte für Zoey entdeckt`;
}
