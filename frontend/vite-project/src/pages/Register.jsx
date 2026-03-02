import { useState } from "react";
import styles from "./Register.module.css"
import CardNav from "../components/CardNav/CardNav.jsx"
import logo from "../assets/LaunchlabLogo.png"
export default function Register() {

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

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [msg, setMsg] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.ok) {
                setMsg("Reģistrācija veiksmīga");
            } else {
                setMsg("Kļūda: " + JSON.stringify(data.errors));
            }
        } catch (err) {
            setMsg("Serveris nav pieejams");
        }
    }

    return (
        <section className={styles.regSection}>
            <div>
            <CardNav logo={logo} items={items}/>
            </div>

                <div className={styles.leftSide}>
                    <h1>
                        Atrodi iespējas. Veido komandas. Radi nākotni.
                    </h1>
                    <p>
                        pēc reģistrācijas jūs tiksiet pārvirzīti uz jusu valdibas paneli
                    </p>
                </div>

                <div className={styles.rightSide}>
                    <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <input name="name" placeholder="Vārds" onChange={handleChange} />
                        <br />

                        <input name="email" placeholder="Email" onChange={handleChange} />
                        <br />

                        <input
                            type="password"
                            name="password"
                            placeholder="Parole"
                            onChange={handleChange}
                        />
                        <br />

                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Apstiprini paroli"
                            onChange={handleChange}
                        />
                        <br />

                        <button>Reģistrēties</button>
                    </form>

                    <p className={styles.message}>{msg}</p>
                </div>

            </div>
        </section>

    );
}
