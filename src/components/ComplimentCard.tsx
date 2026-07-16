import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, Mail, Sparkles } from 'lucide-react';
import { ParticleLayer } from './ParticleLayer';

export interface ComplimentCardProps {
  className?: string;
  compliment: string;
  disabled?: boolean;
  discoveredCount: number;
  glowLevel?: number;
  milestone?: string | null;
  onContinue: () => void;
  onNext: () => void;
  reducedMotion?: boolean;
  totalCount: number;
}

const getMilestone = (count: number, total: number): string | null => {
  if (total > 0 && count >= total) {
    return 'Du hast alle Komplimente entdeckt. Aber ehrlich gesagt reichen selbst diese nicht aus, um dich zu beschreiben. 💗';
  }
  if (count === 20) {
    return 'Geheimnis entdeckt: Ich könnte diese Liste für immer weiterschreiben.';
  }
  if (count === 10) {
    return 'Achievement freigeschaltet: Komplimente-Sammlerin 💌';
  }
  if (count === 5) {
    return 'Du hast schon fünf Gründe entdeckt, warum du besonders bist. Dabei gibt es noch viel mehr. ✨';
  }
  return null;
};

const getGlowLevel = (count: number) => {
  if (count >= 20) return 4;
  if (count >= 10) return 3;
  if (count >= 5) return 2;
  return count > 1 ? 1 : 0;
};

export function ComplimentCard({
  className,
  compliment,
  disabled = false,
  discoveredCount,
  glowLevel,
  milestone,
  onContinue,
  onNext,
  reducedMotion = false,
  totalCount,
}: ComplimentCardProps) {
  const [burstKey, setBurstKey] = useState(0);
  const safeCount = Math.max(0, discoveredCount);
  const safeTotal = Math.max(0, totalCount);
  const activeMilestone = milestone === undefined ? getMilestone(safeCount, safeTotal) : milestone;
  const activeGlowLevel = Math.max(0, Math.min(4, glowLevel ?? getGlowLevel(safeCount)));
  const counterText =
    safeCount === 1
      ? '1 liebes Wort für Zoey entdeckt'
      : `${safeCount} liebe Worte für Zoey entdeckt`;

  const handleNext = () => {
    if (disabled) return;
    setBurstKey((current) => current + 1);
    onNext();
  };

  return (
    <article
      aria-labelledby="compliment-heading"
      className={[
        'compliment-card',
        `compliment-card--glow-${activeGlowLevel}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-glow-level={activeGlowLevel}
    >
      <ParticleLayer
        active={burstKey > 0}
        amount={12}
        burstKey={burstKey}
        className="compliment-card__particles"
        mode="hearts"
        origin={{ x: 50, y: 66 }}
        reducedMotion={reducedMotion}
      />

      <div aria-hidden="true" className="compliment-card__icon-wrap">
        <Mail size={27} strokeWidth={1.55} />
        <Heart className="compliment-card__icon-heart" fill="currentColor" size={13} />
      </div>

      <p className="compliment-card__eyebrow">
        <Sparkles aria-hidden="true" size={16} />
        Nur für dich
      </p>
      <h2 className="compliment-card__heading" id="compliment-heading">
        Liebe Worte für Zoey
      </h2>

      <div aria-atomic="true" aria-live="polite" className="compliment-card__message-wrap">
        <AnimatePresence initial={false} mode="wait">
          <motion.blockquote
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            className="compliment-card__message"
            exit={{ opacity: 0, rotateX: reducedMotion ? 0 : -5, y: reducedMotion ? 0 : -8 }}
            initial={{ opacity: 0, rotateX: reducedMotion ? 0 : 5, y: reducedMotion ? 0 : 10 }}
            key={`${safeCount}-${compliment}`}
            transition={{ duration: reducedMotion ? 0.12 : 0.32, ease: 'easeOut' }}
          >
            “{compliment}”
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <motion.p
        animate={reducedMotion ? undefined : { scale: [1, 1.04, 1] }}
        className="compliment-card__counter"
        key={safeCount}
        transition={{ duration: 0.3 }}
      >
        {counterText}
      </motion.p>

      <AnimatePresence mode="wait">
        {activeMilestone ? (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="compliment-card__milestone"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            key={activeMilestone}
            role="status"
          >
            <Sparkles aria-hidden="true" size={17} />
            <span>{activeMilestone}</span>
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="compliment-card__actions">
        <motion.button
          className="compliment-card__button compliment-card__button--primary"
          disabled={disabled}
          onClick={handleNext}
          type="button"
          whileHover={reducedMotion || disabled ? undefined : { y: -2 }}
          whileTap={reducedMotion || disabled ? undefined : { scale: 0.97 }}
        >
          <Heart aria-hidden="true" fill="currentColor" size={18} />
          Noch ein Kompliment 💌
        </motion.button>
        <motion.button
          className="compliment-card__button compliment-card__button--secondary"
          onClick={onContinue}
          type="button"
          whileHover={reducedMotion ? undefined : { x: 3 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        >
          Weiter zu unserer Geschichte ✨
          <ArrowRight aria-hidden="true" size={18} />
        </motion.button>
      </div>
    </article>
  );
}

export default ComplimentCard;
