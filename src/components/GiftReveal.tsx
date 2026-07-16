import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Heart, Sparkles } from 'lucide-react';
import { ParticleLayer } from './ParticleLayer';

export interface GiftRevealProps {
  className?: string;
  isOpen: boolean;
  message?: string;
  onRevealComplete?: () => void;
  reducedMotion?: boolean;
}

export function GiftReveal({
  className,
  isOpen,
  message = 'Das erste Geschenk bist übrigens du selbst. 💝',
  onRevealComplete,
  reducedMotion = false,
}: GiftRevealProps) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const timer = window.setTimeout(
      () => onRevealComplete?.(),
      reducedMotion ? 160 : 1150,
    );
    return () => window.clearTimeout(timer);
  }, [isOpen, onRevealComplete, reducedMotion]);

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          aria-live="polite"
          className={['gift-reveal', className].filter(Boolean).join(' ')}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.84 }}
          key="open-gift"
          role="status"
          transition={{ duration: reducedMotion ? 0.15 : 0.5, ease: 'easeOut' }}
        >
          <ParticleLayer
            active
            amount={22}
            burstKey="gift-open"
            className="gift-reveal__particles"
            mode="mixed"
            origin={{ x: 50, y: 40 }}
            reducedMotion={reducedMotion}
          />

          <div aria-hidden="true" className="gift-reveal__visual">
            <motion.div
              animate={
                reducedMotion
                  ? { opacity: 0 }
                  : { rotate: -12, x: -18, y: -34 }
              }
              className="gift-reveal__lid"
              initial={{ rotate: 0, x: 0, y: 0 }}
              transition={{ delay: 0.16, duration: 0.58, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="gift-reveal__ribbon gift-reveal__ribbon--horizontal" />
              <Sparkles className="gift-reveal__lid-sparkle" size={18} />
            </motion.div>

            <motion.div
              animate={reducedMotion ? undefined : { scale: [1, 1.06, 1] }}
              className="gift-reveal__box"
              transition={{ delay: 0.08, duration: 0.7 }}
            >
              <span className="gift-reveal__ribbon gift-reveal__ribbon--vertical" />
              <Gift className="gift-reveal__gift-icon" size={38} strokeWidth={1.5} />
            </motion.div>

            <motion.span
              animate={{ opacity: 1, scale: 1, y: reducedMotion ? 0 : -48 }}
              className="gift-reveal__floating-heart"
              initial={{ opacity: 0, scale: 0.3, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.42, duration: 0.62 }}
            >
              <Heart fill="currentColor" size={32} />
            </motion.span>
          </div>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="gift-reveal__message"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            transition={{ delay: reducedMotion ? 0 : 0.62, duration: 0.4 }}
          >
            {message}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default GiftReveal;
