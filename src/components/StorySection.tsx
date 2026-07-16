import {
  useCallback,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, type PanInfo, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight, Gem, Heart, Sparkles, Star, Sun } from 'lucide-react';

export interface StoryChapter {
  accent?: string;
  icon?: ReactNode;
  id?: string;
  text: string;
  title: string;
}

export interface StorySectionProps {
  chapters: readonly StoryChapter[];
  className?: string;
  currentIndex: number;
  heading?: string;
  onComplete: () => void;
  onIndexChange: (nextIndex: number) => void;
  reducedMotion?: boolean;
}

const defaultIcons = [Sparkles, Star, Heart, Sun, Gem] as const;

const cardVariants: Variants = {
  center: { opacity: 1, scale: 1, x: 0 },
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction * 54,
  }),
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction * -54,
  }),
};

export function StorySection({
  chapters,
  className,
  currentIndex,
  heading = 'Unsere kleine Geschichte',
  onComplete,
  onIndexChange,
  reducedMotion = false,
}: StorySectionProps) {
  const safeIndex = chapters.length > 0 ? Math.max(0, Math.min(currentIndex, chapters.length - 1)) : 0;
  const chapter = chapters[safeIndex];
  const [direction, setDirection] = useState(1);

  const move = useCallback(
    (offset: number) => {
      if (chapters.length === 0) return;
      const nextIndex = safeIndex + offset;
      setDirection(offset >= 0 ? 1 : -1);
      if (nextIndex >= chapters.length) {
        onComplete();
        return;
      }
      if (nextIndex >= 0) onIndexChange(nextIndex);
    },
    [chapters.length, onComplete, onIndexChange, safeIndex],
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -55 || info.velocity.x < -280) move(1);
    if (info.offset.x > 55 || info.velocity.x > 280) move(-1);
  };

  if (!chapter) {
    return (
      <section className={['story-section', className].filter(Boolean).join(' ')} id="geschichte">
        <h2 className="story-section__heading">{heading}</h2>
        <p className="story-section__empty">Die Geschichte wartet noch auf ihr erstes Kapitel.</p>
      </section>
    );
  }

  const progress = ((safeIndex + 1) / chapters.length) * 100;
  const ChapterIcon = defaultIcons[safeIndex % defaultIcons.length];
  const sectionStyle = chapter.accent
    ? ({ '--story-accent': chapter.accent } as CSSProperties)
    : undefined;

  return (
    <section
      aria-label={`${heading}. Mit den Pfeiltasten kann zwischen Kapiteln gewechselt werden.`}
      className={['story-section', className].filter(Boolean).join(' ')}
      data-chapter={safeIndex + 1}
      id="geschichte"
      onKeyDown={handleKeyDown}
      style={sectionStyle}
      tabIndex={0}
    >
      <span aria-hidden="true" className="story-section__ambient story-section__ambient--left" />
      <span aria-hidden="true" className="story-section__ambient story-section__ambient--right" />

      <div className="story-section__header">
        <p className="story-section__eyebrow">
          <Heart aria-hidden="true" fill="currentColor" size={15} />
          Eine Reise in fünf Kapiteln
        </p>
        <h2 className="story-section__heading">{heading}</h2>
      </div>

      <div className="story-section__progress-wrap">
        <div
          aria-label={`Kapitel ${safeIndex + 1} von ${chapters.length}`}
          aria-valuemax={chapters.length}
          aria-valuemin={1}
          aria-valuenow={safeIndex + 1}
          className="story-section__progress-track"
          role="progressbar"
        >
          <motion.span
            animate={{ width: `${progress}%` }}
            className="story-section__progress-fill"
            initial={false}
            transition={{ duration: reducedMotion ? 0.1 : 0.45, ease: 'easeOut' }}
          />
        </div>
        <span className="story-section__chapter-count">
          Kapitel {safeIndex + 1} von {chapters.length}
        </span>
      </div>

      <div className="story-section__card-stage">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.article
            animate="center"
            aria-labelledby={`story-chapter-${safeIndex}`}
            className="story-section__card"
            custom={direction}
            drag={reducedMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            exit="exit"
            initial={reducedMotion ? { opacity: 0 } : 'enter'}
            key={chapter.id ?? `${safeIndex}-${chapter.title}`}
            onDragEnd={handleDragEnd}
            transition={{ duration: reducedMotion ? 0.12 : 0.38, ease: [0.2, 0.75, 0.25, 1] }}
            variants={reducedMotion ? undefined : cardVariants}
          >
            <motion.div
              animate={reducedMotion ? undefined : { rotate: [0, 4, -3, 0], scale: [1, 1.06, 1] }}
              aria-hidden="true"
              className="story-section__chapter-icon"
              transition={{ delay: 0.12, duration: 0.75 }}
            >
              {chapter.icon ?? <ChapterIcon size={34} strokeWidth={1.45} />}
            </motion.div>
            <p className="story-section__chapter-kicker">Kapitel {safeIndex + 1}</p>
            <h3 className="story-section__chapter-title" id={`story-chapter-${safeIndex}`}>
              {chapter.title}
            </h3>
            <p className="story-section__chapter-text">{chapter.text}</p>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="story-section__navigation">
        <motion.button
          className="story-section__nav-button story-section__nav-button--back"
          disabled={safeIndex === 0}
          onClick={() => move(-1)}
          type="button"
          whileHover={reducedMotion || safeIndex === 0 ? undefined : { x: -3 }}
          whileTap={reducedMotion || safeIndex === 0 ? undefined : { scale: 0.97 }}
        >
          <ArrowLeft aria-hidden="true" size={19} />
          Zurück
        </motion.button>
        <motion.button
          className="story-section__nav-button story-section__nav-button--next"
          onClick={() => move(1)}
          type="button"
          whileHover={reducedMotion ? undefined : { x: 3 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        >
          {safeIndex === chapters.length - 1 ? 'Zur wichtigsten Erinnerung 💗' : 'Weiter'}
          <ArrowRight aria-hidden="true" size={19} />
        </motion.button>
      </div>
    </section>
  );
}

export default StorySection;
