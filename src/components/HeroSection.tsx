import { useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { Gift, Heart, Sparkles } from 'lucide-react';
import { FloatingHearts } from './FloatingHearts';
import { GiftReveal } from './GiftReveal';

export interface HeroSectionProps {
  className?: string;
  description?: string;
  introDelayMs?: number;
  isGiftOpen: boolean;
  onGiftRevealComplete?: () => void;
  onIntroReady?: () => void;
  onOpenGift: () => void;
  reducedMotion?: boolean;
  showLoader?: boolean;
  subtitle?: string;
  title?: string;
}

export function HeroSection({
  className,
  description =
    'Manchmal reichen normale Worte nicht aus, um zu sagen, wie besonders du bist. Deshalb bekommst du heute deine eigene kleine Website.',
  introDelayMs = 900,
  isGiftOpen,
  onGiftRevealComplete,
  onIntroReady,
  onOpenGift,
  reducedMotion = false,
  showLoader = true,
  subtitle = 'Guck mal, ich habe etwas nur für dich gemacht.',
  title = 'Hey Zoey 💗',
}: HeroSectionProps) {
  const [loaderFinished, setLoaderFinished] = useState(!showLoader);
  const isReady = !showLoader || loaderFinished;

  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springX = useSpring(magneticX, { damping: 18, stiffness: 220 });
  const springY = useSpring(magneticY, { damping: 18, stiffness: 220 });

  useEffect(() => {
    if (!showLoader) {
      onIntroReady?.();
      return undefined;
    }

    const timer = window.setTimeout(
      () => {
        setLoaderFinished(true);
        onIntroReady?.();
      },
      reducedMotion ? Math.min(introDelayMs, 120) : introDelayMs,
    );
    return () => window.clearTimeout(timer);
  }, [introDelayMs, onIntroReady, reducedMotion, showLoader]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    magneticX.set((event.clientX - bounds.left - bounds.width / 2) * 0.16);
    magneticY.set((event.clientY - bounds.top - bounds.height / 2) * 0.16);
  };

  const resetMagnet = () => {
    magneticX.set(0);
    magneticY.set(0);
  };

  return (
    <section
      aria-busy={!isReady}
      aria-labelledby="hero-title"
      className={['hero-section', 'scene-focus-target', className].filter(Boolean).join(' ')}
      id="start"
      tabIndex={-1}
    >
      <FloatingHearts count={18} reducedMotion={reducedMotion} seed={14} />
      <span aria-hidden="true" className="hero-section__glow hero-section__glow--one" />
      <span aria-hidden="true" className="hero-section__glow hero-section__glow--two" />

      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            aria-label="Deine Überraschung wird vorbereitet"
            className="hero-section__loader"
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.12 }}
            initial={{ opacity: 0, scale: 0.8 }}
            key="heart-loader"
            role="status"
          >
            <motion.span
              animate={reducedMotion ? undefined : { scale: [1, 1.18, 1] }}
              className="hero-section__loader-heart"
              transition={{ duration: 0.85, repeat: Number.POSITIVE_INFINITY }}
            >
              <Heart fill="currentColor" size={54} strokeWidth={1.4} />
            </motion.span>
            <span className="sr-only">Einen Herzensmoment bitte …</span>
          </motion.div>
        ) : (
          <motion.div
            animate="visible"
            className="hero-section__content"
            initial="hidden"
            key="hero-content"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: reducedMotion ? 0 : 0.08,
                  staggerChildren: reducedMotion ? 0 : 0.18,
                },
              },
            }}
          >
            <motion.div
              className="hero-section__eyebrow"
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Sparkles aria-hidden="true" size={17} />
              <span>Eine kleine Überraschung</span>
              <Sparkles aria-hidden="true" size={17} />
            </motion.div>

            <motion.h1
              className="hero-section__title"
              id="hero-title"
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 18 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="hero-section__subtitle"
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {subtitle}
            </motion.p>

            <motion.p
              className="hero-section__description"
              variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {description}
            </motion.p>

            <motion.div
              className="hero-section__action-wrap"
              variants={{
                hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.94 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <motion.button
                aria-expanded={isGiftOpen}
                aria-label={isGiftOpen ? 'Geschenk ist geöffnet' : 'Geschenk für Zoey öffnen'}
                className="hero-section__gift-button"
                disabled={isGiftOpen}
                onBlur={resetMagnet}
                onClick={onOpenGift}
                onPointerCancel={resetMagnet}
                onPointerLeave={resetMagnet}
                onPointerMove={handlePointerMove}
                style={{ x: springX, y: springY }}
                type="button"
                whileHover={reducedMotion || isGiftOpen ? undefined : { scale: 1.035 }}
                whileTap={reducedMotion || isGiftOpen ? undefined : { scale: 0.97 }}
              >
                <Gift aria-hidden="true" size={21} />
                <span>{isGiftOpen ? 'Geschenk geöffnet 💝' : 'Öffne dein Geschenk 🎁'}</span>
              </motion.button>
            </motion.div>

            <GiftReveal
              isOpen={isGiftOpen}
              onRevealComplete={onGiftRevealComplete}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default HeroSection;
