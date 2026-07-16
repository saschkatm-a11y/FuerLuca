export interface StoryChapter {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly symbol: string;
  readonly mood: "dawn" | "blush" | "dream" | "twilight" | "forever";
}

export const storyChapters = [
  {
    id: "manche-menschen",
    title: "Manche Menschen",
    text: "Es gibt Menschen, die begegnen einem und verschwinden irgendwann wieder. Und dann gibt es Menschen wie dich.",
    symbol: "✦",
    mood: "dawn",
  },
  {
    id: "ploetzlich-besonders",
    title: "Plötzlich besonders",
    text: "Menschen, bei denen man merkt, dass ein gewöhnlicher Tag viel schöner sein kann, nur weil sie da sind.",
    symbol: "✨",
    mood: "blush",
  },
  {
    id: "mit-dir",
    title: "Mit dir",
    text: "Mit dir möchte ich lachen, neue Dinge erleben, albern sein und auch die ruhigen Momente genießen.",
    symbol: "☾",
    mood: "dream",
  },
  {
    id: "ganz-egal-was-kommt",
    title: "Ganz egal was kommt",
    text: "Ganz egal, wie chaotisch das Leben manchmal wird: Ich möchte, dass du nie vergisst, wie wichtig du mir bist.",
    symbol: "♡",
    mood: "twilight",
  },
  {
    id: "genau-du",
    title: "Genau du",
    text: "Und falls du dich irgendwann fragst, ob du genug bist: Du bist mehr als genug. Du bist Zoey – und genau so liebe ich dich.",
    symbol: "♥",
    mood: "forever",
  },
] as const satisfies readonly StoryChapter[];

export type StoryChapterId = (typeof storyChapters)[number]["id"];
