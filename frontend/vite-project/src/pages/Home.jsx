import styles from "./Home.module.css";
import Hero from "../components/Hero/Hero";
import Carousel from "../components/Slider/Carousel";
import Projects from "../components/Projects/Projects";
import CardNav from "../components/CardNav/CardNav";
import logo from "../assets/LaunchlabLogo.png";

export default function Home() {
    const items = [
        {
            label: "About",
            bgColor: "#E3FE8D",
            textColor: "#000000",
            links: [
                { label: "Company", ariaLabel: "About Company", href: "/about" },
                { label: "Careers", ariaLabel: "About Careers", href: "/careers" },
            ],
        },
        {
            label: "Projects",
            bgColor: "#E3FE8D",
            textColor: "#000000",
            links: [
                { label: "Featured", ariaLabel: "Featured Projects", href: "/projects" },
                { label: "Case Studies", ariaLabel: "Project Case Studies", href: "/cases" },
            ],
        },
        {
            label: "Contact",
            bgColor: "#E3FE8D",
            textColor: "#000000",
            links: [
                { label: "Email", ariaLabel: "Email us", href: "mailto:hello@launchlab.lv" },
                { label: "Twitter", ariaLabel: "Twitter", href: "https://twitter.com" },
                { label: "LinkedIn", ariaLabel: "LinkedIn", href: "https://linkedin.com" },
            ],
        },
    ];

    return (
        <div className={styles.home}>
            <CardNav
                logo={logo}
                logoAlt="LaunchLab"
                items={items}
                baseColor="#fff"
                menuColor="#000"
                buttonBgColor="#111"
                buttonTextColor="#fff"
                ease="power3.out"
            />

            <Hero />

            <section className={styles.sliderBg}>
                <div style={{ position: "relative" }}>
                    <Carousel baseWidth={800} autoplay autoplayDelay={3000} pauseOnHover loop round={false} />
                </div>
            </section>

            <Projects />
        </div>
    );
}
