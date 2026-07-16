import { useCallback, useEffect, useRef } from "react";

export interface SceneNavigationOptions {
  onArrive?: () => void;
  onCancel?: () => void;
}

const NAVIGATION_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  " ",
]);

const easeInOutQuad = (progress: number) =>
  progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

export function useSceneNavigation(reducedMotion = false) {
  const animationFrameRef = useRef<number | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const onCancelRef = useRef<(() => void) | null>(null);
  const removeIntentListenersRef = useRef<(() => void) | null>(null);

  const cancelNavigation = useCallback((notify = true) => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (focusFrameRef.current !== null) {
      window.cancelAnimationFrame(focusFrameRef.current);
      focusFrameRef.current = null;
    }

    removeIntentListenersRef.current?.();
    removeIntentListenersRef.current = null;
    document.documentElement.classList.remove("is-scene-navigating");

    const onCancel = onCancelRef.current;
    onCancelRef.current = null;
    if (notify) onCancel?.();
  }, []);

  useEffect(() => () => cancelNavigation(false), [cancelNavigation]);

  useEffect(() => {
    if (reducedMotion) cancelNavigation();
  }, [cancelNavigation, reducedMotion]);

  return useCallback(
    (id: string, options: SceneNavigationOptions = {}) => {
      cancelNavigation();

      const target = document.getElementById(id);
      if (!target) return;

      const startY = window.scrollY;
      const targetY = Math.max(
        0,
        Math.round(startY + target.getBoundingClientRect().top),
      );
      const distance = targetY - startY;

      const finish = () => {
        window.scrollTo(0, targetY);
        options.onArrive?.();

        focusFrameRef.current = window.requestAnimationFrame(() => {
          focusFrameRef.current = null;
          document.getElementById(id)?.focus({ preventScroll: true });
        });
      };

      if (reducedMotion || Math.abs(distance) < 2) {
        finish();
        return;
      }

      const duration = Math.min(
        1_100,
        Math.max(650, 500 + Math.abs(distance) * 0.22),
      );
      let startedAt: number | null = null;

      const cancelOnIntent = () => cancelNavigation();
      const cancelOnKey = (event: KeyboardEvent) => {
        if (NAVIGATION_KEYS.has(event.key)) cancelNavigation();
      };

      window.addEventListener("pointerdown", cancelOnIntent, { passive: true });
      window.addEventListener("touchstart", cancelOnIntent, { passive: true });
      window.addEventListener("wheel", cancelOnIntent, { passive: true });
      window.addEventListener("keydown", cancelOnKey);

      removeIntentListenersRef.current = () => {
        window.removeEventListener("pointerdown", cancelOnIntent);
        window.removeEventListener("touchstart", cancelOnIntent);
        window.removeEventListener("wheel", cancelOnIntent);
        window.removeEventListener("keydown", cancelOnKey);
      };

      document.documentElement.classList.add("is-scene-navigating");
      onCancelRef.current = options.onCancel ?? null;

      const animate = (now: number) => {
        startedAt ??= now;
        const progress = Math.min(1, (now - startedAt) / duration);
        const nextY = startY + distance * easeInOutQuad(progress);
        window.scrollTo(0, Math.round(nextY));

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(animate);
          return;
        }

        animationFrameRef.current = null;
        removeIntentListenersRef.current?.();
        removeIntentListenersRef.current = null;
        document.documentElement.classList.remove("is-scene-navigating");
        onCancelRef.current = null;
        finish();
      };

      animationFrameRef.current = window.requestAnimationFrame(animate);
    },
    [cancelNavigation, reducedMotion],
  );
}

export default useSceneNavigation;
