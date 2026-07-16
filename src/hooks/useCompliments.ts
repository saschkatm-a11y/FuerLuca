import { useCallback, useMemo } from "react";
import {
  compliments,
  formatComplimentCount,
  getComplimentMilestone,
  type Compliment,
} from "../data/compliments";
import { useLocalStorage } from "./useLocalStorage";

interface StoredComplimentProgress {
  currentIndex: number;
  discoveredIndices: number[];
}

export interface ComplimentProgress {
  readonly currentCompliment: Compliment;
  readonly currentIndex: number;
  readonly discoveredCount: number;
  readonly discoveredIndices: readonly number[];
  readonly countLabel: string;
  readonly milestone: string | null;
  readonly glowLevel: 0 | 1 | 2 | 3 | 4;
  readonly isComplete: boolean;
  readonly showNextCompliment: () => void;
  readonly resetCompliments: () => void;
}

const INITIAL_PROGRESS: StoredComplimentProgress = {
  currentIndex: 0,
  discoveredIndices: [0],
};

function normalizeProgress(
  progress: StoredComplimentProgress,
): StoredComplimentProgress {
  const validIndices = Array.from(
    new Set(
      Array.isArray(progress.discoveredIndices)
        ? progress.discoveredIndices.filter(
            (index) =>
              Number.isInteger(index) &&
              index >= 0 &&
              index < compliments.length,
          )
        : [],
    ),
  );

  const currentIndex =
    Number.isInteger(progress.currentIndex) &&
    progress.currentIndex >= 0 &&
    progress.currentIndex < compliments.length
      ? progress.currentIndex
      : 0;

  if (!validIndices.includes(currentIndex)) {
    validIndices.push(currentIndex);
  }

  return {
    currentIndex,
    discoveredIndices: validIndices.length > 0 ? validIndices : [0],
  };
}

function pickRandomIndex(indices: readonly number[]): number {
  return indices[Math.floor(Math.random() * indices.length)] ?? 0;
}

function getGlowLevel(discoveredCount: number): 0 | 1 | 2 | 3 | 4 {
  if (discoveredCount >= compliments.length) return 4;
  if (discoveredCount >= 20) return 3;
  if (discoveredCount >= 10) return 2;
  if (discoveredCount >= 5) return 1;
  return 0;
}

export function useCompliments(
  storageKey = "zoey-love:compliments",
): ComplimentProgress {
  const [storedProgress, setStoredProgress, removeStoredProgress] =
    useLocalStorage<StoredComplimentProgress>(storageKey, INITIAL_PROGRESS);
  const progress = useMemo(
    () => normalizeProgress(storedProgress),
    [storedProgress],
  );

  const showNextCompliment = useCallback(() => {
    setStoredProgress((previousProgress) => {
      const previous = normalizeProgress(previousProgress);
      const discovered = new Set(previous.discoveredIndices);
      const unseen = compliments
        .map((_, index) => index)
        .filter((index) => !discovered.has(index));
      const candidates =
        unseen.length > 0
          ? unseen
          : compliments
              .map((_, index) => index)
              .filter((index) => index !== previous.currentIndex);
      const nextIndex = pickRandomIndex(candidates);
      discovered.add(nextIndex);

      return {
        currentIndex: nextIndex,
        discoveredIndices: Array.from(discovered),
      };
    });
  }, [setStoredProgress]);

  const resetCompliments = useCallback(() => {
    removeStoredProgress();
  }, [removeStoredProgress]);

  const discoveredCount = progress.discoveredIndices.length;

  return {
    currentCompliment: compliments[progress.currentIndex],
    currentIndex: progress.currentIndex,
    discoveredCount,
    discoveredIndices: progress.discoveredIndices,
    countLabel: formatComplimentCount(discoveredCount),
    milestone: getComplimentMilestone(discoveredCount),
    glowLevel: getGlowLevel(discoveredCount),
    isComplete: discoveredCount >= compliments.length,
    showNextCompliment,
    resetCompliments,
  };
}
