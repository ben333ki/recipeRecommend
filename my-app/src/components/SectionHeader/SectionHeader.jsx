import styles from './SectionHeader.module.css';

export default function SectionHeader() {
  return (
    <div className={styles.head}>
      <h2 className={styles.title}>RECOMMENDED</h2>
      <p className={styles.subtitle}>Recipes</p>
    </div>
  );
}
