import { useState, useRef, useCallback, useEffect } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import styles from './Carousel.module.css';

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function getVisible() {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 480) return 1;
  if (window.innerWidth < 768) return 2;
  if (window.innerWidth < 1100) return 3;
  return 4;
}

export default function Carousel({ recipes }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(getVisible);
  const trackRef = useRef(null);
  const startXRef = useRef(0);

  const maxIndex = Math.max(0, recipes.length - visible);

  const goTo = useCallback((i) => {
    setIndex(Math.max(0, Math.min(i, maxIndex)));
  }, [maxIndex]);

  // Recalculate on resize
  useEffect(() => {
    const onResize = () => {
      setVisible(getVisible());
      setIndex(0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Compute translate
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardEl = track.querySelector('article');
    if (!cardEl) return;
    const cardW = cardEl.offsetWidth + 24; // gap=24
    track.style.transform = `translateX(-${index * cardW}px)`;
  }, [index, visible]);

  // Pointer drag / swipe
  const onPointerDown = (e) => { startXRef.current = e.clientX; };
  const onPointerUp = (e) => {
    const diff = startXRef.current - e.clientX;
    if (Math.abs(diff) > 40) goTo(index + (diff > 0 ? 1 : -1));
  };

  const totalDots = maxIndex + 1;

  return (
    <div className={styles.outer}>
      {/* Prev */}
      <button
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        aria-label="Previous recipes"
      >
        <ChevronLeft />
      </button>

      {/* Track */}
      <div
        className={styles.trackWrap}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className={styles.track} ref={trackRef}>
          {recipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      </div>

      {/* Next */}
      <button
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => goTo(index + 1)}
        disabled={index >= maxIndex}
        aria-label="Next recipes"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className={styles.dots} role="tablist" aria-label="Carousel pages">
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === index}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
