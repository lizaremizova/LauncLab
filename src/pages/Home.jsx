import Header from "../components/Header/Header";
import styles from "./Home.module.css";
import Hero from "../components/Hero/Hero";

export default function Home() {
    return (
        <div className={styles.home}>
            <Header />
            <Hero />
        </div>
    );
}
