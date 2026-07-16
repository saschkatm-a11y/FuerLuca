import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export type ParticleMode = 'hearts' | 'mixed' | 'sparkles';

export interface ParticleOrigin {
  x: number;
  y: number;
}

export interface ParticleLayerProps {
  active?: boolean;
  amount?: number;
  burstKey?: number | string;
  className?: string;
  mode?: ParticleMode;
  onBurstComplete?: () => void;
  origin?: ParticleOrigin;
  reducedMotion?: boolean;
}

interface ParticleDescriptor {
  delay: number;
  duration: number;
  dx: number;
  dy: number;
  id: number;
  kind: 'dot' | 'heart' | 'sparkle';
  rotation: number;
  scale: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getKind = (index: number, mode: ParticleMode): ParticleDescriptor['kind'] => {
  if (mode === 'hearts') return 'heart';
  if (mode === 'sparkles') return index % 3 === 0 ? 'dot' : 'sparkle';
  return (['heart', 'sparkle', 'dot'] as const)[index % 3];
};

export function ParticleLayer({
  active = false,
  amount = 18,
  burstKey = 0,
  className,
  mode = 'mixed',
  onBurstComplete,
  origin = { x: 50, y: 50 },
  reducedMotion = false,
}: ParticleLayerProps) {
  const [particles, setParticles] = useState<ParticleDescriptor[]>([]);
  const sequence = useRef(0);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    sequence.current += 1;
    const safeAmount = reducedMotion
      ? Math.min(Math.max(0, Math.floor(amount)), 5)
      : Math.min(Math.max(0, Math.floor(amount)), 36);
    const duration = reducedMotion ? 0.55 : 1.35;
    const nextParticles = Array.from({ length: safeAmount }, (_, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(safeAmount, 1) - Math.PI / 2;
      const distance = reducedMotion ? 18 + (index % 3) * 4 : 62 + (index % 6) * 14;
      const spread = Math.sin((index + 1) * 4.17) * 18;

      return {
        delay: reducedMotion ? 0 : (index % 5) * 0.025,
        duration: duration + (index % 4) * 0.08,
        dx: Math.cos(angle) * distance + spread,
        dy: Math.sin(angle) * distance - (reducedMotion ? 4 : 28),
        id: sequence.current * 100 + index,
        kind: getKind(index, mode),
        rotation: ((index * 47) % 180) - 90,
        scale: 0.65 + (index % 5) * 0.13,
      } satisfies ParticleDescriptor;
    });

    setParticles(nextParticles);
    const cleanupTimer = window.setTimeout(
      () => {
        setParticles([]);
        onBurstComplete?.();
      },
      (duration + 0.65) * 1000,
    );

    return () => window.clearTimeout(cleanupTimer);
  }, [active, amount, burstKey, mode, onBurstComplete, reducedMotion]);

  const layerStyle = {
    '--particle-origin-x': `${clamp(origin.x, 0, 100)}%`,
    '--particle-origin-y': `${clamp(origin.y, 0, 100)}%`,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={['particle-layer', className].filter(Boolean).join(' ')}
      style={layerStyle}
    >
      <AnimatePresence>
        {(active ? particles : []).map((particle) => (
          <motion.span
            animate={{
              opacity: [0, 1, 0],
              rotate: particle.rotation,
              scale: [0.2, particle.scale, particle.scale * 0.72],
              x: particle.dx,
              y: particle.dy,
            }}
            className={`particle-layer__particle particle-layer__particle--${particle.kind}`}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
            key={particle.id}
            transition={{
              delay: particle.delay,
              duration: particle.duration,
              ease: [0.18, 0.75, 0.28, 1],
            }}
          >
            {particle.kind === 'heart' ? (
              <Heart fill="currentColor" size="1em" strokeWidth={1.4} />
            ) : particle.kind === 'sparkle' ? (
              <Sparkles size="1em" strokeWidth={1.7} />
            ) : (
              <span className="particle-layer__dot" />
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ParticleLayer;
