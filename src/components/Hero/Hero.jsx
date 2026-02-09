import styles from "./Hero.module.css";
import arrow from "../../assets/arrow.svg";
export default function Hero() {
    return(
        <section>
           <div className={styles.heroText}>
               <h1>
                   LAUNCLAB
               </h1>
               <h2>
                   Atrodi <span>iespējas.</span> Veido <span>komandas.</span> Radi <spnan>nākotni.</spnan>
               </h2>
           </div>
            <div className={styles.buttons}>
                <a className={styles.greenButton}>
                    sākt tagad <span> <img src={arrow} alt="arrow" /> </span>
                </a>
                <a className={styles.whiteButton}>
                    iespējas
                </a>
            </div>
        </section>

    )
}
