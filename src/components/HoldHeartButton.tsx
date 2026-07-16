import { Heart } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useHoldProgress } from "../hooks/useHoldProgress";

export interface HoldHeartButtonProps {
  label?: string;
  completedMessage?: string;
  duration?: number;
  disabled?: boolean;
  className?: string;
  resetKey?: string | number;
  onComplete?: () => void;
}

const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function HoldHeartButton({
  label = "Drück mich ganz fest 💗",
  completedMessage = "Ich liebe dich, Zoey.",
  duration = 2_000,
  disabled = false,
  className = "",
  resetKey,
  onComplete,
}: HoldHeartButtonProps) {
  const descriptionId = useId();
  const { progress, isHolding, isComplete, start, cancel, reset } =
    useHoldProgress({ duration, disabled, onComplete });

  useEffect(() => {
    reset();
  }, [reset, resetKey]);

  const releasePointer = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      cancel();
    },
    [cancel],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || disabled || isComplete) return;

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      start();
    },
    [disabled, isComplete, start],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (
        (event.key === " " || event.key === "Enter") &&
        !event.repeat &&
        !disabled &&
        !isComplete
      ) {
        event.preventDefault();
        start();
      }
    },
    [disabled, isComplete, start],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        cancel();
      }
    },
    [cancel],
  );

  return (
    <div
      className={`hold-heart ${isHolding ? "hold-heart--active" : ""} ${
        isComplete ? "hold-heart--complete" : ""
      } ${className}`.trim()}
    >
      <button
        aria-describedby={descriptionId}
        aria-label={
          isComplete
            ? completedMessage
            : `${label}. Etwa zwei Sekunden gedrückt halten.`
        }
        aria-pressed={isComplete}
        className="hold-heart__button"
        disabled={disabled}
        onBlur={cancel}
        onClick={(event) => event.preventDefault()}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onLostPointerCapture={cancel}
        onPointerCancel={releasePointer}
        onPointerDown={handlePointerDown}
        onPointerUp={releasePointer}
        type="button"
      >
        <span className="hold-heart__visual" aria-hidden="true">
          <svg className="hold-heart__ring" viewBox="0 0 112 112">
            <circle
              className="hold-heart__ring-track"
              cx="56"
              cy="56"
              fill="none"
              r={RING_RADIUS}
              strokeWidth="5"
            />
            <circle
              className="hold-heart__ring-progress"
              cx="56"
              cy="56"
              fill="none"
              r={RING_RADIUS}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
              strokeLinecap="round"
              strokeWidth="5"
              transform="rotate(-90 56 56)"
            />
          </svg>
          <Heart
            className="hold-heart__icon"
            fill="currentColor"
            size={48}
            style={{ transform: `scale(${0.86 + progress * 0.28})` }}
          />
        </span>
        <span className="hold-heart__label">
          {isComplete ? completedMessage : label}
        </span>
      </button>

      <span className="sr-only" id={descriptionId}>
        {isComplete
          ? "Herzensnachricht vollständig geöffnet."
          : isHolding
            ? `${Math.round(progress * 100)} Prozent gehalten.`
            : "Mit Maus, Touch, Leertaste oder Eingabetaste gedrückt halten."}
      </span>
      <span aria-live="polite" className="sr-only" role="status">
        {isComplete ? completedMessage : ""}
      </span>
    </div>
  );
}
