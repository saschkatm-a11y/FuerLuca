import { useCallback, useEffect, useRef, useState } from "react";

export interface UseHoldProgressOptions {
  duration?: number;
  disabled?: boolean;
  onComplete?: () => void;
}

export interface HoldProgressControls {
  readonly progress: number;
  readonly isHolding: boolean;
  readonly isComplete: boolean;
  readonly start: () => void;
  readonly cancel: () => void;
  readonly reset: () => void;
}

const getNow = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

export function useHoldProgress({
  duration = 2_000,
  disabled = false,
  onComplete,
}: UseHoldProgressOptions = {}): HoldProgressControls {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const completeRef = useRef(false);

  const clearScheduledUpdate = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    if (completeRef.current) return;

    activeRef.current = false;
    completeRef.current = true;
    clearScheduledUpdate();
    setProgress(1);
    setIsHolding(false);
    setIsComplete(true);
    onComplete?.();
  }, [clearScheduledUpdate, onComplete]);

  const start = useCallback(() => {
    if (disabled || activeRef.current || completeRef.current) return;

    const safeDuration = Math.max(100, duration);
    const startedAt = getNow();
    activeRef.current = true;
    setIsHolding(true);
    setProgress(0);

    const update = () => {
      if (!activeRef.current) return;

      const nextProgress = Math.min(1, (getNow() - startedAt) / safeDuration);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        finish();
        return;
      }

      if (typeof window.requestAnimationFrame === "function") {
        animationFrameRef.current = window.requestAnimationFrame(update);
      } else {
        timeoutRef.current = window.setTimeout(update, 16);
      }
    };

    update();
  }, [disabled, duration, finish]);

  const cancel = useCallback(() => {
    if (!activeRef.current) return;

    activeRef.current = false;
    clearScheduledUpdate();
    setIsHolding(false);
    setProgress(0);
  }, [clearScheduledUpdate]);

  const reset = useCallback(() => {
    activeRef.current = false;
    completeRef.current = false;
    clearScheduledUpdate();
    setProgress(0);
    setIsHolding(false);
    setIsComplete(false);
  }, [clearScheduledUpdate]);

  useEffect(() => {
    if (disabled) cancel();
  }, [cancel, disabled]);

  useEffect(
    () => () => {
      activeRef.current = false;
      clearScheduledUpdate();
    },
    [clearScheduledUpdate],
  );

  return { progress, isHolding, isComplete, start, cancel, reset };
}
