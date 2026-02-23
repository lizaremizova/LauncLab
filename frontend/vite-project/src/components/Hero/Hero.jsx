import styles from "./Hero.module.css";
import titleBg from "../../assets/titleBg.png";
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <clipPath id="hero-cutout" clipPathUnits="objectBoundingBox">

                        <path d="M 0,0
                                 L 1,0
                                 L 1,0.7
                                 C 1,0.75 0.98,0.75 0.95,0.75
                                 L 0.7,0.75
                                 C 0.65,0.75 0.65,0.77 0.65,0.82
                                 L 0.65,1
                                 L 0,1
                                 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.leftSection}>
                        <div className={styles.imageSection}>
                            <img
                                src={titleBg}
                                alt="Team collaboration"
                                className={styles.heroImage}
                            />
                            <button className={styles.categoryBtn}>
                                skatīt visas kategorijas
                            </button>
                        </div>

                        <div className={styles.greenCard}>
                            <h2>pelni ar to, ko proti vislabāk</h2>
                            <p>pārvērt savas zināšanas ieņākumos bez liekas sarežģītības</p>
                            <button className={styles.actionBtn}>
                                kā tas strādā?
                            </button>
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <div className={styles.header}>
                            <h1>
                                <span className={styles.launchText}>LAUNCH</span>
                                <span className={styles.labText}>LAB</span>
                            </h1>
                            <p className={styles.subtitle}>
                                pārvērt idejas reālos produktos ar mūms
                            </p>
                        </div>

                        <div className={styles.tags}>
                            <Link to="/ui-ux-dizains" className={styles.tag}>ui/ux dizains</Link>
                            <Link to="/mobilas-lietotnes" className={styles.tag}>mobilās lietotnes</Link>
                            <Link to="/automatizacija" className={styles.tag}>automatizācija</Link>
                            <Link to="/api-izstrade" className={styles.tag}>api izstrāde</Link>
                            <Link to="/ai-risinajumi" className={styles.tag}>ai risinājumi</Link>
                            <Link to="/timekla-izstrade" className={styles.tag}>tīmekļa izstrāde</Link>
                            <Link to="/programmaturas-izstrade" className={styles.tag}>programmatūras izstrāde</Link>
                            <Link to="/zimolu-dizains" className={styles.tag}>zīmolu dizains</Link>
                        </div>

                        <div className={styles.buttons}>
                            <Link to="/register" className={styles.registerBtn}>reģistrēties</Link>
                            <Link to="/login" className={styles.loginBtn}>pieslēgties</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
