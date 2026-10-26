import styles from './Matiere.module.css';

export function Matiere({ tone }: { tone: 'clair' | 'canard' }) {
  return <div aria-hidden="true" data-matiere={tone} className={`${styles.matiere} ${styles[tone]}`} />;
}
