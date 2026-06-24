import { useState, useRef, useEffect } from 'react';
import RecipeModal from '../RecipeModal/RecipeModal';
import styles from './RecipeCard.module.css';

const TAG_TYPES = { spicy: styles.tagSpicy, sweet: styles.tagSweet, fresh: styles.tagFresh };

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function RecipeCard({ recipe, index }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  // Scroll-reveal
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <article
        ref={ref}
        className={`${styles.card} ${visible ? styles.visible : ''}`}
        style={{ transitionDelay: `${index * 60}ms` }}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View ${recipe.name} recipe`}
        onKeyDown={e => e.key === 'Enter' && setModalOpen(true)}
      >
        {/* Image */}
        <div className={styles.imgWrap}>
          <img src={recipe.image} alt={recipe.name} loading="lazy" />
          <span className={styles.badge}>{recipe.badge}</span>
          <span className={styles.timeBadge}>
            <ClockIcon /> {recipe.time.split(' ')[0]} min
          </span>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.tags}>
            {recipe.tags.map(t => (
              <span key={t.label} className={`${styles.tag} ${TAG_TYPES[t.type] || ''}`}>
                {t.label}
              </span>
            ))}
          </div>
          <h3 className={styles.name}>{recipe.name}</h3>
          <div className={styles.meta}>
            <ClockIcon /> {recipe.time}
            <PeopleIcon /> {recipe.servings} servings
          </div>
        </div>

        {/* View recipe hint */}
        <div className={styles.viewHint}>
          <span>View Recipe</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </article>

      {/* Popup Modal */}
      {modalOpen && (
        <RecipeModal recipe={recipe} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
