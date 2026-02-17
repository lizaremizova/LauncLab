import Header from "../components/Header/Header";
import styles from "./Home.module.css";
import Hero from "../components/Hero/Hero";
import Carousel from "../components/Slider/Carousel";

export default function Home() {
    return (
        <div className={styles.home}>
            <Header />
            <Hero />
            <section className={styles.sliderBg}>
                <div style={{ position: "relative"}}>
                    <Carousel
                        baseWidth={800}
                        autoplay={true}
                        autoplayDelay={3000}
                        pauseOnHover={true}
                        loop={true}
                        round={false}
                    />
                </div>
            </section>

        </div>
    );
}
