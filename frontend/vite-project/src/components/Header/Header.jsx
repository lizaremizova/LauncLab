import styles from "./Header.module.css";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className={styles.header}>
            <Link to="/register" className={styles.link}>Reģistrēties</Link>
            <a className={styles.link}>pieslēgties</a>
            <Link to="/" className={styles.link}>Sākums</Link>
            <a className={styles.link}>darbi</a>
            <a className={styles.link}>projekti</a>
            <a className={styles.link}>kā tas strāda</a>
        </header>
    );
}
