import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import styles from "./Register.module.css";
import CardNav from "../components/CardNav/CardNav.jsx";
import logo from "../assets/LaunchlabLogo.png";

export default function Register() {
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [form, setForm] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
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

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('id', data.user.id);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('name', data.user.name);
                localStorage.setItem('USER_NAME', data.user.name);
                localStorage.setItem('description', data.user.description || "");
                localStorage.setItem('TOKEN', data.token);
                setMsg("Reģistrācija veiksmīga!");
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                const errorMessage = data.errors
                    ? JSON.stringify(data.errors)
                    : (data.message || "Servera kļūda (500)");
                setMsg("Kļūda: " + errorMessage);
            }
        } catch {
            setMsg("Serveris nav pieejams");
        }
    }

    return (
        <section className={styles.regSection}>
            <div>
                <CardNav logo={logo} items={items} />
            </div>

            <div className={styles.leftSide}>
               <div className={styles.leftSideContainer}>
                   <h1>Atrodi iespējas. Veido komandas. Radi nākotni.</h1>

                   <p>Pēc reģistrācijas jūs tiksiet pārvirzīti uz jūsu valdības paneli.</p>
               </div>
                <Link to="/dashboard" className={styles.guestButton}>
                    ienākt kā viesis
                </Link>

            </div>

            <div className={styles.rightSide}>
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <input name="username" placeholder="lietotājvārds" onChange={handleChange} />
                        <br />
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
                        <button type="submit">Reģistrēties</button>
                        <Link to="/login" className={styles.link}>jau ir izveidots konts?</Link>
                    </form>
                    <p className={styles.message}>{msg}</p>
                </div>
            </div>
        </section>
    );
}
