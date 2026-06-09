import styles from "./Home.module.css";
import Hero from "../components/Hero/Hero";
import Projects from "../components/Projects/Projects";
import CardNav from "../components/CardNav/CardNav";
import logo from "../assets/LaunchlabLogo.png";

export default function Home() {
    const items = [
        {
            label: "par mums",
            bgColor: "#E3FE8D",
            textColor: "#000000",
            links: [
                { label: "Kompanija", ariaLabel: "About Company", href: "/" },
                { label: "karjera", ariaLabel: "About Careers", href: "/" },
            ],
        },
        {
            label: "projekti",
            bgColor: "#E3FE8D",
            textColor: "#000000",
            links: [
                { label: "projekti", ariaLabel: "Featured Projects", href: "/" },
                { label: "darbi", ariaLabel: "Project Case Studies", href: "/" },
            ],
        },
        {
            label: "kontakti",
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

            <div className={styles.afterHero}>
                <Projects />
            </div>

            <section className={styles.section}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionTop}>
                        <h2 className={styles.h2}>Iespējas</h2>
                        <p className={styles.sectionLead}>
                            Viss, kas vajadzīgs uzdevumam: skaidrs apraksts, pieteikumi, pielikumi un rezultāts vienā plūsmā.
                        </p>
                    </div>

                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.kicker}>Ātri</div>
                            <h3 className={styles.h3}>Atrast piemērotu uzdevumu</h3>
                            <p className={styles.p}>
                                Pārlūko sludinājumus, filtrē pēc kategorijām un piesakies dažu sekunžu laikā.
                            </p>
                        </div>
                        <div className={styles.featureCardAlt}>
                            <div className={styles.kickerAlt}>Pārskatāmi</div>
                            <h3 className={styles.h3}>Sadarbība bez jucekļa</h3>
                            <p className={styles.p}>
                                Redzi pieteikumu statusus un apstiprinātos darbus vienuviet, bez liekas sarakstes.
                            </p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.kicker}>Faili</div>
                            <h3 className={styles.h3}>Pielikumi un rezultāti</h3>
                            <p className={styles.p}>
                                Autors pievieno uzdevuma pielikumus, izpildītājs iesniedz rezultātu, un viss ir lejupielādējams.
                            </p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.kicker}>Droši</div>
                            <h3 className={styles.h3}>Piekļuve tikai iesaistītajiem</h3>
                            <p className={styles.p}>
                                Pielikumus un rezultātus redz tikai sludinājuma autors un apstiprinātais izpildītājs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionTint}`}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionTop}>
                        <h2 className={styles.h2}>Kā tas darbojas</h2>
                        <p className={styles.sectionLead}>
                            Četri soļi no idejas līdz iesniegtam failam. Vienkārši un paredzami.
                        </p>
                    </div>

                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>1</div>
                            <div className={styles.stepBody}>
                                <div className={styles.stepTitle}>Izveido sludinājumu</div>
                                <div className={styles.p}>Apraksti uzdevumu, pievieno termiņu un (ja vajag) pielikumus.</div>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumAlt}>2</div>
                            <div className={styles.stepBody}>
                                <div className={styles.stepTitle}>Saņem pieteikumus</div>
                                <div className={styles.p}>Izvēlies piemērotāko kandidātu un apstiprini pieteikumu.</div>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNum}>3</div>
                            <div className={styles.stepBody}>
                                <div className={styles.stepTitle}>Iesniedz rezultātu</div>
                                <div className={styles.p}>Izpildītājs augšupielādē paveikto, un autors to var lejupielādēt.</div>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumAlt}>4</div>
                            <div className={styles.stepBody}>
                                <div className={styles.stepTitle}>Lejupielādē un noslēdz</div>
                                <div className={styles.p}>Autors saņem gatavo failu, apskata un saglabā sev.</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.statGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>1</div>
                            <div className={styles.statLabel}>vieta pieteikumiem un failiem</div>
                        </div>
                        <div className={styles.statCardAlt}>
                            <div className={styles.statValue}>0</div>
                            <div className={styles.statLabel}>“kur tas fails palika?”</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>4</div>
                            <div className={styles.statLabel}>soļi līdz rezultātam</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionTop}>
                        <h2 className={styles.h2}>Atsauksmes</h2>
                        <p className={styles.sectionLead}>
                            Nelieli uzdevumi, ātra izpilde, skaidra komunikācija. Tieši tāpēc cilvēki to izvēlas.
                        </p>
                    </div>

                    <div className={styles.quoteGrid}>
                        <figure className={styles.quoteCard}>
                            <blockquote className={styles.quoteText}>
                                “Beidzot viss ir vienā vietā: pielikumi, apstiprinājums un rezultāts. Ļoti ērti.”
                            </blockquote>
                            <figcaption className={styles.quoteBy}>Ilze, produktu dizains</figcaption>
                        </figure>
                        <figure className={styles.quoteCardAlt}>
                            <blockquote className={styles.quoteText}>
                                “Pieteicos, saņēmu apstiprinājumu un uzreiz redzēju uzdevuma failus. Nekādu pārpratumu.”
                            </blockquote>
                            <figcaption className={styles.quoteBy}>Mārtiņš, izstrāde</figcaption>
                        </figure>
                        <figure className={styles.quoteCard}>
                            <blockquote className={styles.quoteText}>
                                “Man kā autoram patīk, ka rezultātu var lejupielādēt tieši no sludinājuma.”
                            </blockquote>
                            <figcaption className={styles.quoteBy}>Anna, mārketings</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionTint}`}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionTop}>
                        <h2 className={styles.h2}>Biežāk uzdotie jautājumi</h2>
                        <p className={styles.sectionLead}>
                            Īsas atbildes uz tipiskajiem jautājumiem pirms pirmā sludinājuma vai pieteikuma.
                        </p>
                    </div>

                    <div className={styles.faqGrid}>
                        <details className={styles.faqItem}>
                            <summary className={styles.faqQ}>Kas redz pielikumus un rezultātu?</summary>
                            <div className={styles.faqA}>
                                Pielikumus un rezultātu var lejupielādēt sludinājuma autors un apstiprinātais izpildītājs.
                            </div>
                        </details>
                        <details className={styles.faqItem}>
                            <summary className={styles.faqQ}>Kā notiek apstiprināšana?</summary>
                            <div className={styles.faqA}>
                                Autors izvēlas vienu pieteikumu un apstiprina. Pārējie pieteikumi paliek gaidīšanas statusā.
                            </div>
                        </details>
                        <details className={styles.faqItem}>
                            <summary className={styles.faqQ}>Vai varu pievienot rezultātu vēlāk?</summary>
                            <div className={styles.faqA}>
                                Jā. Apstiprinātajā pieteikumā vari augšupielādēt rezultātu, kad darbs ir pabeigts.
                            </div>
                        </details>
                        <details className={styles.faqItem}>
                            <summary className={styles.faqQ}>Kādi failu tipi ir atbalstīti?</summary>
                            <div className={styles.faqA}>
                                Vari pievienot jebkuru tipisku failu (piemēram, PDF, attēlus vai arhīvus). Lielums atkarīgs no servera
                                iestatījumiem.
                            </div>
                        </details>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionInner}>
                    <div className={styles.ctaBand}>
                        <div className={styles.ctaText}>
                            <h2 className={styles.ctaTitle}>Sāc ar pirmo sludinājumu jau šodien</h2>
                            <p className={styles.ctaLead}>Publicē uzdevumu vai piesakies darbam un seko statusiem vienuviet.</p>
                        </div>
                        <div className={styles.ctaButtons}>
                            <a className={styles.ctaBtnPrimary} href="/register">
                                Izveidot kontu
                            </a>
                            <a className={styles.ctaBtnSecondary} href="/jobs">
                                Skatīt darbus
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionInner}>
                    <div className={styles.sectionTop}>
                        <h2 className={styles.h2}>Par LaunchLab</h2>
                        <p className={styles.sectionLead}>
                            LaunchLab ir vienkārša vide īstermiņa uzdevumiem: no sludinājuma līdz rezultātam ar failiem un statusiem.
                        </p>
                    </div>

                    <div className={styles.aboutGrid}>
                        <div className={styles.about}>
                            <p className={styles.p}>
                                Mērķis ir skaidra plūsma: autors publicē sludinājumu, kandidāti piesakās, autors apstiprina vienu pieteikumu,
                                un izpildītājs iesniedz rezultātu. Bez liekas failu meklēšanas un bez neskaidriem statusiem.
                            </p>
                            <div className={styles.aboutBadge}>
                                <span className={styles.badgeDot} />
                                <span className={styles.badgeText}>Vienkārši. Pārskatāmi. Praktiski.</span>
                            </div>
                        </div>

                        <div className={styles.aboutHighlight}>
                            <div className={styles.aboutHighlightTitle}>Kam tas der?</div>
                            <div className={styles.aboutHighlightList}>
                                <div className={styles.aboutHighlightItem}>Mazie darbi un mikrouzdevumi</div>
                                <div className={styles.aboutHighlightItem}>Studentu projekti un prakses uzdevumi</div>
                                <div className={styles.aboutHighlightItem}>Ātras dizaina / teksta / izstrādes vajadzības</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerTitle}>LaunchLab</div>
                        <div className={styles.footerText}>Darbi un projekti vienā plūsmā.</div>
                    </div>
                    <div className={styles.footerLinks}>
                        <a className={styles.footerLink} href="mailto:hello@launchlab.lv">
                            hello@launchlab.lv
                        </a>
                        <a className={styles.footerLink} href="/login">
                            Pieslēgties
                        </a>
                        <a className={styles.footerLink} href="/register">
                            Reģistrēties
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
