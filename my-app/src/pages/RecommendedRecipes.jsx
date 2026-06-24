import SectionHeader from '../components/SectionHeader/SectionHeader';
import Carousel from '../components/Carousel/Carousel';
import { recipes } from '../data/recipes';
import styles from './RecommendedRecipes.module.css';

export default function RecommendedRecipes() {
  return (
    <section className={styles.page} aria-labelledby="recipes-heading">
      {/* Ambient glow blobs */}
      <div className={styles.blobTop} aria-hidden="true" />
      <div className={styles.blobBottom} aria-hidden="true" />

      {/* Header */}
      <SectionHeader />

      {/* Carousel */}
      <Carousel recipes={recipes} />
    </section>
  );
}
