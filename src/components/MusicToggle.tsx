import { Music2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MusicAvailability = "checking" | "available" | "unavailable";

export interface MusicToggleProps {
  src?: string;
  className?: string;
  loop?: boolean;
  hideWhenUnavailable?: boolean;
}

function getDefaultAudioSource(): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.endsWith("/") ? base : `${base}/`}assets/love-song.mp3`;
}

export function MusicToggle({
  src,
  className = "",
  loop = true,
  hideWhenUnavailable = true,
}: MusicToggleProps) {
  const audioSource = useMemo(() => src ?? getDefaultAudioSource(), [src]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [availability, setAvailability] =
    useState<MusicAvailability>("checking");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    const prepareAudio = async () => {
      try {
        const response = await fetch(audioSource, {
          method: "HEAD",
          cache: "no-store",
          signal: controller.signal,
        });
        const contentType = response.headers.get("content-type") ?? "";

        if (
          !response.ok ||
          contentType.toLowerCase().includes("text/html") ||
          disposed
        ) {
          if (!disposed) setAvailability("unavailable");
          return;
        }

        const audio = new Audio(audioSource);
        audio.loop = loop;
        audio.preload = "metadata";

        const handleEnded = () => setIsPlaying(false);
        const handleError = () => {
          audio.pause();
          if (!disposed) {
            setIsPlaying(false);
            setAvailability("unavailable");
          }
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError, { once: true });
        audioRef.current = audio;
        setAvailability("available");

        return () => {
          audio.removeEventListener("ended", handleEnded);
          audio.removeEventListener("error", handleError);
        };
      } catch {
        if (!disposed && !controller.signal.aborted) {
          setAvailability("unavailable");
        }
      }

      return undefined;
    };

    let removeAudioListeners: (() => void) | undefined;
    void prepareAudio().then((cleanup) => {
      if (disposed) {
        cleanup?.();
        audioRef.current?.pause();
        audioRef.current = null;
      } else {
        removeAudioListeners = cleanup;
      }
    });

    return () => {
      disposed = true;
      controller.abort();
      removeAudioListeners?.();
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [audioSource, loop]);

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || availability !== "available") return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [availability]);

  if (availability === "unavailable" && hideWhenUnavailable) {
    return null;
  }

  const isUnavailable = availability !== "available";
  const label = isPlaying ? "Musik aus" : "Musik an";

  return (
    <button
      aria-label={
        isUnavailable ? "Keine optionale Musikdatei verfügbar" : label
      }
      aria-pressed={isPlaying}
      className={`music-toggle button button--ghost ${className}`.trim()}
      disabled={isUnavailable}
      onClick={() => void toggleMusic()}
      title={
        isUnavailable
          ? "Lege love-song.mp3 im Ordner public/assets ab, um Musik zu aktivieren."
          : label
      }
      type="button"
    >
      {isPlaying ? (
        <VolumeX aria-hidden="true" size={18} />
      ) : (
        <Music2 aria-hidden="true" size={18} />
      )}
      <span>{availability === "checking" ? "Musik prüfen …" : label}</span>
    </button>
  );
}
