import type { CSSProperties } from "react";

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  showChapterLabel?: boolean;
}

export function ProgressIndicator({
  current,
  total,
  label = "Fortschritt der Liebesgeschichte",
  className = "",
  showChapterLabel = true,
}: ProgressIndicatorProps) {
  const safeTotal = Math.max(1, Math.floor(total));
  const safeCurrent = Math.min(
    safeTotal,
    Math.max(1, Math.floor(Number.isFinite(current) ? current : 1)),
  );
  const fraction = safeCurrent / safeTotal;

  return (
    <div className={`progress-indicator ${className}`.trim()}>
      {showChapterLabel ? (
        <span className="progress-indicator__label">
          Kapitel {safeCurrent} von {safeTotal}
        </span>
      ) : null}
      <div
        aria-label={label}
        aria-valuemax={safeTotal}
        aria-valuemin={1}
        aria-valuenow={safeCurrent}
        className="progress-indicator__track"
        role="progressbar"
      >
        <span
          aria-hidden="true"
          className="progress-indicator__fill"
          style={
            {
              transform: `scaleX(${fraction})`,
              transformOrigin: "left center",
            } satisfies CSSProperties
          }
        />
      </div>
    </div>
  );
}
