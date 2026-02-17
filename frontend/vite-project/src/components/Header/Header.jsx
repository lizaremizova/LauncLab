import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <a className={styles.link}>reģistrēties</a>
            <a className={styles.link}>pieslēgties</a>
            <a className={styles.link}>sākums</a>
            <a className={styles.link}>darbi</a>
            <a className={styles.link}>projekti</a>
            <a className={styles.link}>kā tas strāda</a>
        </header>
    );
}
