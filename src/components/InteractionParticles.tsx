import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

interface InteractionParticle {
  id: number;
  kind: 'heart' | 'sparkle';
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  rotation: number;
  size: number;
}

export interface InteractionParticlesProps {
  reducedMotion?: boolean;
}

const MAX_PARTICLES = 24;
const TRAIL_INTERVAL_MS = 76;

export function InteractionParticles({ reducedMotion = false }: InteractionParticlesProps) {
  const [particles, setParticles] = useState<InteractionParticle[]>([]);
  const sequenceRef = useRef(0);
  const lastTrailAtRef = useRef(0);
  const timersRef = useRef(new Map<number, number>());

  const addParticle = useCallback(
    (x: number, y: number, kind: InteractionParticle['kind']) => {
      if (reducedMotion) return;

      sequenceRef.current += 1;
      const id = sequenceRef.current;
      const phase = id * 1.618;
      const particle: InteractionParticle = {
        id,
        kind,
        x,
        y,
        driftX: Math.sin(phase) * (kind === 'heart' ? 34 : 20),
        driftY: -(38 + (id % 5) * 9),
        rotation: ((id * 43) % 90) - 45,
        size: kind === 'heart' ? 13 + (id % 4) * 2 : 10 + (id % 3) * 2,
      };

      setParticles((current) => [...current, particle].slice(-MAX_PARTICLES));

      const timer = window.setTimeout(() => {
        setParticles((current) => current.filter((entry) => entry.id !== id));
        timersRef.current.delete(id);
      }, 900);
      timersRef.current.set(id, timer);
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const now = performance.now();
      if (now - lastTrailAtRef.current < TRAIL_INTERVAL_MS) return;
      lastTrailAtRef.current = now;
      addParticle(event.clientX, event.clientY, 'sparkle');
    };

    const handlePointerDown = (event: PointerEvent) => {
      addParticle(event.clientX, event.clientY, event.pointerType === 'touch' ? 'heart' : 'sparkle');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [addParticle, reducedMotion]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  return (
    <div aria-hidden="true" className="interaction-particles">
      <AnimatePresence>
        {(reducedMotion ? [] : particles).map((particle) => (
          <motion.span
            animate={{
              opacity: [0, 0.95, 0],
              rotate: particle.rotation,
              scale: [0.45, 1, 0.7],
              x: particle.driftX,
              y: particle.driftY,
            }}
            className={`interaction-particles__item interaction-particles__item--${particle.kind}`}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
            key={particle.id}
            style={
              {
                '--particle-size': `${particle.size}px`,
                left: particle.x,
                top: particle.y,
              } as CSSProperties
            }
            transition={{ duration: 0.82, ease: [0.18, 0.74, 0.28, 1] }}
          >
            {particle.kind === 'heart' ? (
              <Heart fill="currentColor" size="1em" />
            ) : (
              <Sparkles size="1em" />
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default InteractionParticles;
