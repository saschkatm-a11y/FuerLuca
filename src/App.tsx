import { Heart, Sparkles, Star } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ComplimentCard } from './components/ComplimentCard';
import { HeroSection } from './components/HeroSection';
import { HoldHeartButton } from './components/HoldHeartButton';
import { InteractionParticles } from './components/InteractionParticles';
import { LoveReminder } from './components/LoveReminder';
import { MusicToggle } from './components/MusicToggle';
import { ParticleLayer } from './components/ParticleLayer';
import { SecretHeart } from './components/SecretHeart';
import { StorySection } from './components/StorySection';
import { TooltipMessage } from './components/TooltipMessage';
import { compliments } from './data/compliments';
import { storyChapters } from './data/story';
import { useCompliments } from './hooks/useCompliments';
import { useReducedMotion } from './hooks/useReducedMotion';

function scrollToSection(id: string, reducedMotion: boolean) {
  document.getElementById(id)?.scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}

function App() {
  const reducedMotion = useReducedMotion();
  const complimentProgress = useCompliments();
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isHeartComplete, setIsHeartComplete] = useState(false);
  const [journeyKey, setJourneyKey] = useState(0);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const [giftBurstKey, setGiftBurstKey] = useState(0);
  const [isGiftBurstActive, setIsGiftBurstActive] = useState(false);
  const [isWishVisible, setIsWishVisible] = useState(false);
  const [hiddenComplimentDismissed, setHiddenComplimentDismissed] = useState(false);

  const handleOpenGift = useCallback(() => {
    if (isGiftOpen) return;
    setIsGiftOpen(true);
    setGiftBurstKey((current) => current + 1);
    setIsGiftBurstActive(true);
  }, [isGiftOpen]);

  const handleGiftRevealComplete = useCallback(() => {
    scrollToSection('komplimente', reducedMotion);
  }, [reducedMotion]);

  const handleHoldComplete = useCallback(() => {
    setIsHeartComplete(true);
    setCelebrationKey((current) => current + 1);
  }, []);

  const handleRestart = useCallback(() => {
    complimentProgress.resetCompliments();
    setIsGiftOpen(false);
    setStoryIndex(0);
    setIsHeartComplete(false);
    setIsGiftBurstActive(false);
    setIsWishVisible(false);
    setHiddenComplimentDismissed(false);
    setJourneyKey((current) => current + 1);
    window.requestAnimationFrame(() => scrollToSection('start', reducedMotion));
  }, [complimentProgress, reducedMotion]);

  const showHiddenCompliment =
    complimentProgress.discoveredCount >= 7 && !hiddenComplimentDismissed;

  return (
    <div className="app-shell">
      <div aria-hidden="true" className="app-shell__aurora" />
      <InteractionParticles reducedMotion={reducedMotion} />
      <ParticleLayer
        active={isGiftBurstActive}
        amount={34}
        burstKey={giftBurstKey}
        className="app-gift-burst"
        mode="mixed"
        onBurstComplete={() => setIsGiftBurstActive(false)}
        origin={{ x: 50, y: 46 }}
        reducedMotion={reducedMotion}
      />

      <header className="app-topbar">
        <a aria-label="Zurück zum Anfang" className="app-brand" href="#start">
          <span aria-hidden="true" className="app-brand__mark">
            <Heart fill="currentColor" size={18} />
          </span>
          <span className="app-brand__label">Für Zoey</span>
        </a>
        <MusicToggle key={`music-${journeyKey}`} />
      </header>

      <main>
        <HeroSection
          isGiftOpen={isGiftOpen}
          key={`hero-${journeyKey}`}
          onGiftRevealComplete={handleGiftRevealComplete}
          onOpenGift={handleOpenGift}
          reducedMotion={reducedMotion}
        />

        <section aria-labelledby="compliments-scene-title" className="compliments-scene scene" id="komplimente">
          <div className="compliments-scene__intro">
            <p className="section-kicker">25 + 1 kleine Wahrheiten</p>
            <h2 className="section-title" id="compliments-scene-title">
              Dinge, die du über dich wissen solltest.
            </h2>
            <p className="section-copy">
              Manche Worte darf man ruhig mehr als einmal hören. Sammle sie in deinem eigenen Tempo.
            </p>
          </div>

          <div className="compliments-scene__card-wrap">
            <ComplimentCard
              compliment={complimentProgress.currentCompliment}
              discoveredCount={complimentProgress.discoveredCount}
              glowLevel={complimentProgress.glowLevel}
              milestone={complimentProgress.milestone}
              onContinue={() => scrollToSection('geschichte', reducedMotion)}
              onNext={complimentProgress.showNextCompliment}
              reducedMotion={reducedMotion}
              totalCount={compliments.length}
            />
            <TooltipMessage
              className="compliments-scene__hidden-message"
              isVisible={showHiddenCompliment}
              message="Selbst diese Website kann nicht zeigen, wie viel du mir bedeutest."
              onDismiss={() => setHiddenComplimentDismissed(true)}
              tone="gold"
            />
          </div>
        </section>

        <StorySection
          chapters={storyChapters}
          currentIndex={storyIndex}
          key={`story-${journeyKey}`}
          onComplete={() => scrollToSection('erinnerung', reducedMotion)}
          onIndexChange={setStoryIndex}
          reducedMotion={reducedMotion}
        />

        <LoveReminder
          celebrationKey={celebrationKey}
          holdButton={
            <HoldHeartButton
              key={`hold-${journeyKey}`}
              onComplete={handleHoldComplete}
              resetKey={journeyKey}
            />
          }
          isComplete={isHeartComplete}
          onRestart={handleRestart}
          reducedMotion={reducedMotion}
        />
      </main>

      <div className="easter-eggs" key={`secrets-${journeyKey}`}>
        <SecretHeart className="easter-eggs__heart" requiredClicks={5} />
        <div className="easter-eggs__star-wrap">
          <button
            aria-label="Funkelnden Wunschstern öffnen"
            aria-pressed={isWishVisible}
            className="easter-eggs__star"
            onClick={() => setIsWishVisible(true)}
            type="button"
          >
            <Star aria-hidden="true" fill="currentColor" size={19} />
            <span className="sr-only">Geheimer Wunschstern</span>
          </button>
          <TooltipMessage
            className="easter-eggs__wish"
            isVisible={isWishVisible}
            message="Ein kleiner Wunsch für dich: Ich hoffe, du weißt jeden Tag, wie wertvoll du bist. ⭐"
            onDismiss={() => setIsWishVisible(false)}
            tone="gold"
          />
        </div>
      </div>

      <footer className="app-footer">
        <span>Mit ganz viel Liebe gemacht</span>
        <span className="app-footer__spark">
          <Sparkles aria-hidden="true" size={15} /> Nur für Zoey
        </span>
      </footer>
    </div>
  );
}

export default App;
