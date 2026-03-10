import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import styles from "./Register.module.css";
import CardNav from "../components/CardNav/CardNav.jsx";
import logo from "../assets/LaunchlabLogo.png";

export default function Login() {
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");

    // Login only needs email and password
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

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

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg("Notiek autorizācija...");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('TOKEN', data.token);
                localStorage.setItem('USER_NAME', data.user.name);
                navigate('/dashboard');
            } else {
                setMsg(data.message || "pārbaudiet datus");
            }
        } catch (err) {
            setMsg("Serveris nav pieejams");
        }
    };

    return (
        <section className={styles.regSection}>
            <div>
                <CardNav logo={logo} items={items} />
            </div>

            <div className={styles.leftSide}>
               <div className={styles.leftSideContainer}>
                   <h1>Sveicināti atpakaļ!</h1>

                   <p>Lūdzu, ievadiet savus datus, lai piekļūtu savam profilam.</p>
               </div>

                <Link to="/dashboard" className={styles.guestButton}>
                    ienākt kā viesis
                </Link>
            </div>

            <div className={styles.rightSide}>
                <div className={styles.formContainer}>
                    <form onSubmit={handleLogin}>
                        <input
                            name="email"
                            type="email"
                            placeholder="E-pasts"
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <input
                            type="password"
                            name="password"
                            placeholder="Parole"
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <button type="submit">Pieslēgties</button>
                        <Link to="/register" className={styles.link}>vēl nav konta?</Link>
                    </form>
                    <p className={styles.message}>{msg}</p>
                </div>
            </div>
        </section>
    );
}
