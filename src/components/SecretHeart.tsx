import { Heart } from "lucide-react";
import { useCallback, useState } from "react";
import { TooltipMessage } from "./TooltipMessage";

const DEFAULT_MESSAGE =
  "Du hast das geheime Herz gefunden. Aber ehrlich gesagt: Mein Herz hattest du sowieso schon. 💘";

export interface SecretHeartProps {
  requiredClicks?: number;
  message?: string;
  className?: string;
  onDiscover?: () => void;
}

export function SecretHeart({
  requiredClicks = 5,
  message = DEFAULT_MESSAGE,
  className = "",
  onDiscover,
}: SecretHeartProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isDiscovered, setIsDiscovered] = useState(false);
  const safeRequiredClicks = Math.max(2, Math.floor(requiredClicks));

  const handleClick = useCallback(() => {
    if (isDiscovered) return;

    setClickCount((previousCount) => {
      const nextCount = previousCount + 1;
      if (nextCount >= safeRequiredClicks) {
        setIsDiscovered(true);
        onDiscover?.();
      }
      return nextCount;
    });
  }, [isDiscovered, onDiscover, safeRequiredClicks]);

  return (
    <div className={`secret-heart ${className}`.trim()}>
      <button
        aria-label={
          isDiscovered
            ? "Geheimes Herz entdeckt"
            : "Ein kleines, geheimnisvolles Herz"
        }
        aria-pressed={isDiscovered}
        className={`secret-heart__button ${
          isDiscovered ? "secret-heart__button--discovered" : ""
        }`.trim()}
        onClick={handleClick}
        type="button"
      >
        <Heart
          aria-hidden="true"
          fill={isDiscovered ? "currentColor" : "none"}
          size={18}
        />
        <span className="sr-only">
          {isDiscovered
            ? "Du hast das geheime Herz gefunden."
            : `${clickCount} von ${safeRequiredClicks} Berührungen`}
        </span>
      </button>
      <TooltipMessage
        isVisible={isDiscovered}
        message={message}
        tone="gold"
      />
    </div>
  );
}
