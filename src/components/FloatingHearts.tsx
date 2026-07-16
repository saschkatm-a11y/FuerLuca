import { useMemo, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export interface FloatingHeartsProps {
  className?: string;
  count?: number;
  reducedMotion?: boolean;
  seed?: number;
}

interface FloatingHeartDescriptor {
  delay: number;
  drift: number;
  duration: number;
  id: string;
  opacity: number;
  rotation: number;
  size: number;
  x: number;
}

const fraction = (value: number) => value - Math.floor(value);

const pseudoRandom = (index: number, seed: number, salt: number) =>
  fraction(Math.sin((index + 1) * 12.9898 + seed * 78.233 + salt) * 43758.5453);

export function FloatingHearts({
  className,
  count = 16,
  reducedMotion = false,
  seed = 11,
}: FloatingHeartsProps) {
  const hearts = useMemo<FloatingHeartDescriptor[]>(() => {
    const safeCount = Math.max(0, Math.min(Math.floor(count), 28));

    return Array.from({ length: safeCount }, (_, index) => ({
      delay: pseudoRandom(index, seed, 1) * 8,
      drift: Math.round((pseudoRandom(index, seed, 2) - 0.5) * 96),
      duration: 10 + pseudoRandom(index, seed, 3) * 9,
      id: `${seed}-${index}`,
      opacity: 0.14 + pseudoRandom(index, seed, 4) * 0.28,
      rotation: Math.round((pseudoRandom(index, seed, 5) - 0.5) * 80),
      size: 10 + Math.round(pseudoRandom(index, seed, 6) * 22),
      x: 2 + pseudoRandom(index, seed, 7) * 96,
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden="true"
      className={['floating-hearts', className].filter(Boolean).join(' ')}
    >
      {hearts.map((heart) => {
        const style = {
          '--heart-opacity': heart.opacity,
          fontSize: heart.size,
          left: `${heart.x}%`,
        } as CSSProperties;

        return (
          <motion.span
            animate={
              reducedMotion
                ? { opacity: heart.opacity * 0.65 }
                : {
                    opacity: [0, heart.opacity, heart.opacity, 0],
                    rotate: [heart.rotation, -heart.rotation * 0.35, heart.rotation * 0.5],
                    x: [0, heart.drift, heart.drift * -0.25],
                    y: ['10vh', '-112vh'],
                  }
            }
            className="floating-hearts__item"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: '12vh' }}
            key={heart.id}
            style={style}
            transition={
              reducedMotion
                ? { duration: 0.5 }
                : {
                    delay: heart.delay,
                    duration: heart.duration,
                    ease: 'linear',
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 0.4,
                  }
            }
          >
            <Heart fill="currentColor" size="1em" strokeWidth={1.35} />
          </motion.span>
        );
      })}
    </div>
  );
}

export default FloatingHearts;
