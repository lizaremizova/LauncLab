import { useState } from "react";
import styles from "./Register.module.css"
export default function Register() {
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
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMsg("Reģistrācija veiksmīga ✅");
            } else {
                setMsg("Kļūda: " + JSON.stringify(data.errors));
            }
        } catch (err) {
            setMsg("Serveris nav pieejams");
        }
    }

    return (
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

            <p>{msg}</p>
        </div>
    );
}
