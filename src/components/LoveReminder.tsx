import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { FloatingHearts } from './FloatingHearts';
import { ParticleLayer } from './ParticleLayer';

const defaultLines = [
  'Du wirst geliebt.',
  'Du bist wichtig.',
  'Du bist wunderschön.',
  'Du bist mehr als genug.',
  'Und ich bin sehr glücklich, dich zu haben. ❤️',
] as const;

export interface LoveReminderProps {
  celebrationKey?: number | string;
  className?: string;
  finalMessage?: string;
  holdButton: ReactNode;
  isComplete: boolean;
  lines?: readonly string[];
  onRestart: () => void;
  reducedMotion?: boolean;
}

export function LoveReminder({
  celebrationKey,
  className,
  finalMessage = 'Ich liebe dich, Zoey.',
  holdButton,
  isComplete,
  lines = defaultLines,
  onRestart,
  reducedMotion = false,
}: LoveReminderProps) {
  return (
    <section
      aria-labelledby="love-reminder-heading"
      className={['love-reminder', className].filter(Boolean).join(' ')}
      id="erinnerung"
    >
      <FloatingHearts count={12} reducedMotion={reducedMotion} seed={31} />
      <ParticleLayer
        active={isComplete}
        amount={30}
        burstKey={celebrationKey ?? `love-complete-${isComplete}`}
        className="love-reminder__celebration"
        mode="mixed"
        origin={{ x: 50, y: 64 }}
        reducedMotion={reducedMotion}
      />
      <span aria-hidden="true" className="love-reminder__halo" />

      <motion.div
        className="love-reminder__card"
        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.97, y: reducedMotion ? 0 : 24 }}
        transition={{ duration: reducedMotion ? 0.12 : 0.55, ease: 'easeOut' }}
        viewport={{ amount: 0.25, once: true }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
      >
        <div aria-hidden="true" className="love-reminder__icon">
          <Heart fill="currentColor" size={34} strokeWidth={1.4} />
          <Sparkles className="love-reminder__icon-sparkle" size={17} />
        </div>

        <p className="love-reminder__eyebrow">Nur eine kleine Erinnerung für dich, Zoey:</p>
        <h2 className="love-reminder__heading" id="love-reminder-heading">
          Vergiss das niemals
        </h2>

        <div className="love-reminder__lines">
          {lines.map((line, index) => (
            <motion.p
              initial={{ opacity: 0, x: reducedMotion ? 0 : -12 }}
              key={`${index}-${line}`}
              transition={{ delay: reducedMotion ? 0 : 0.12 + index * 0.2, duration: 0.36 }}
              viewport={{ amount: 0.8, once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          className="love-reminder__outro"
          initial={{ opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.25, duration: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          Diese Seite endet hier. Meine Liebe zu dir nicht.
        </motion.p>

        <div className="love-reminder__hold-control">{holdButton}</div>

        <div aria-atomic="true" aria-live="polite" className="love-reminder__result">
          <AnimatePresence>
            {isComplete ? (
              <motion.p
                animate={{ opacity: 1, scale: 1 }}
                className="love-reminder__final-message"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
                key="love-complete"
                transition={{ duration: reducedMotion ? 0.12 : 0.45, ease: 'backOut' }}
              >
                <Heart aria-hidden="true" fill="currentColor" size={21} />
                {finalMessage}
                <Heart aria-hidden="true" fill="currentColor" size={21} />
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.button
          className="love-reminder__restart-button"
          onClick={onRestart}
          type="button"
          whileHover={reducedMotion ? undefined : { rotate: -1.5, scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        >
          <RotateCcw aria-hidden="true" size={18} />
          Reise noch einmal starten
        </motion.button>
      </motion.div>
    </section>
  );
}

export default LoveReminder;
