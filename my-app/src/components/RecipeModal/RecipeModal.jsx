import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './RecipeModal.module.css';

const TAG_TYPES = { spicy: styles.tagSpicy, sweet: styles.tagSweet, fresh: styles.tagFresh };

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function RecipeModal({ recipe, onClose }) {
  // Lock body scroll & handle Escape key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Parse steps into array
  const steps = recipe.steps.split(' · ');

  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={recipe.name}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className={styles.imgWrap}>
          <img src={recipe.image} alt={recipe.name} />
          <div className={styles.imgOverlay} />

          {/* Badges on image */}
          <span className={styles.badge}>{recipe.badge}</span>

          {/* Close button */}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>

          {/* Title on image */}
          <div className={styles.imgTitle}>
            <div className={styles.tags}>
              {recipe.tags.map(t => (
                <span key={t.label} className={`${styles.tag} ${TAG_TYPES[t.type] || ''}`}>
                  {t.label}
                </span>
              ))}
            </div>
            <h2 className={styles.name}>{recipe.name}</h2>
            <div className={styles.meta}>
              <span><ClockIcon /> {recipe.time}</span>
              <span><PeopleIcon /> {recipe.servings} servings</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Ingredients */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🥣</span> Ingredients
            </h3>
            <ul className={styles.ingredientList}>
              {recipe.ingredients.split(', ').map((ing, i) => (
                <li key={i} className={styles.ingredientItem}>
                  <span className={styles.bullet} />
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Steps */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>👨‍🍳</span> Steps
            </h3>
            <ol className={styles.stepList}>
              {steps.map((step, i) => (
                <li key={i} className={styles.stepItem}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
