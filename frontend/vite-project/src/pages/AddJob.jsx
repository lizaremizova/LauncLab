import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AddJob.module.css';
import logo from "../assets/LaunchlabLogo.png";

const AddJob = () => {
    const navigate = useNavigate();

    // I added 'kategorijas' as an array to handle multiple selections
    const [formData, setFormData] = useState({
        nosaukums: '',
        apraksts: '',
        budzets: '',
        termina_dienas: '',
        kategorijas: []
    });

    // Available categories (you can fetch these from DB later)
    const availableCategories = [
        { id: 1, name: 'Dizains' },
        { id: 2, name: 'Izstrāde' },
        { id: 3, name: 'Mārketings' },
        { id: 4, name: 'Teksti' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleCategory = (id) => {
        setFormData(prev => ({
            ...prev,
            kategorijas: prev.kategorijas.includes(id)
                ? prev.kategorijas.filter(katId => katId !== id)
                : [...prev.kategorijas, id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation check
        if (formData.kategorijas.length === 0) {
            alert("Lūdzu izvēlies vismaz vienu kategoriju!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                console.error("Server Error:", errorData);
                alert("Kļūda pievienojot darbu. Pārbaudiet datus konsolē.");
            }
        } catch (err) {
            console.error("Connection error:", err);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <Link to="/dashboard" className={styles.logoPill}>
                    <img src={logo} alt="Logo" className={styles.logoImg} />
                </Link>
                <h1 className={styles.title}>Pievienot jaunu sludinājumu</h1>
            </header>

            <main className={styles.formCard}>
                <form onSubmit={handleSubmit} className={styles.jobForm}>
                    <div className={styles.inputGroup}>
                        <label>Virsraksts</label>
                        <input
                            name="nosaukums"
                            className={styles.mainInput}
                            placeholder="Piemēram: React Dashboard izstrāde"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Izvēlies kategorijas (vairākas)</label>
                        <div className={styles.categoryGrid}>
                            {availableCategories.map(kat => (
                                <button
                                    key={kat.id}
                                    type="button"
                                    className={formData.kategorijas.includes(kat.id) ? styles.katActive : styles.katInactive}
                                    onClick={() => toggleCategory(kat.id)}
                                >
                                    {kat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Darba apraksts</label>
                        <textarea
                            name="apraksts"
                            className={styles.mainTextarea}
                            placeholder="Aprakstiet veicamos uzdevumus..."
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>Budžets (EUR)</label>
                            <input
                                type="number"
                                name="budzets"
                                className={styles.mainInput}
                                placeholder="0.00"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Izpildes termiņš (dienās)</label>
                            <input
                                type="number"
                                name="termina_dienas"
                                className={styles.mainInput}
                                placeholder="7"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={() => navigate(-1)} className={styles.btnCancel}>Atcelt</button>
                        <button type="submit" className={styles.btnSubmit}>Publicēt darbu</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddJob;
