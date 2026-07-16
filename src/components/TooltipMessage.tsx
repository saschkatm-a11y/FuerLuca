import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface TooltipMessageProps {
  message: ReactNode;
  isVisible?: boolean;
  onDismiss?: () => void;
  id?: string;
  className?: string;
  tone?: "rose" | "gold";
}

export function TooltipMessage({
  message,
  isVisible = true,
  onDismiss,
  id,
  className = "",
  tone = "rose",
}: TooltipMessageProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`tooltip-message tooltip-message--${tone} ${className}`.trim()}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96, y: 6 }
          }
          id={id}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96, y: 8 }
          }
          role="status"
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.24 }}
        >
          <span className="tooltip-message__spark" aria-hidden="true">
            ✦
          </span>
          <span className="tooltip-message__text">{message}</span>
          {onDismiss ? (
            <button
              aria-label="Nachricht schließen"
              className="tooltip-message__close"
              onClick={onDismiss}
              type="button"
            >
              <X aria-hidden="true" size={16} strokeWidth={2} />
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
