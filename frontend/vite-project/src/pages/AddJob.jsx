import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AddJob.module.css';
import logo from "../assets/LaunchlabLogo.png";

const AddJob = () => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        budget: '',
        deadline_days: '',
        categories: []
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('TOKEN');

        if (!token) {
            alert("Session expired. Please log in again.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                alert("Server error: " + (errorData.message || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
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
                            name="name"
                            className={styles.mainInput}
                            placeholder="Piemēram: React Dashboard izstrāde"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Kategorijas</label>
                        <div className={styles.dropdownWrapper}>
                            <button
                                type="button"
                                className={styles.dropdownButton}
                                onClick={() => setIsCategoryOpen(prev => !prev)}
                            >
                                {formData.categories.length > 0
                                    ? categories
                                        .filter(cat => formData.categories.includes(cat.id))
                                        .map(cat => cat.name)
                                        .join(', ')
                                    : 'Izvēlieties kategorijas'}
                            </button>

                            {isCategoryOpen && (
                                <div className={styles.dropdownMenu}>
                                    {categories.map(cat => (
                                        <label key={cat.id} className={styles.dropdownItem}>
                                            <input
                                                type="checkbox"
                                                checked={formData.categories.includes(cat.id)}
                                                onChange={() => {
                                                    setFormData(prev => {
                                                        const alreadySelected = prev.categories.includes(cat.id);
                                                        return {
                                                            ...prev,
                                                            categories: alreadySelected
                                                                ? prev.categories.filter(id => id !== cat.id)
                                                                : [...prev.categories, cat.id]
                                                        };
                                                    });
                                                }}
                                            />
                                            <span>{cat.name?.length > 20
                                                ? `${cat.name.substring(0, 20)}...`
                                                : cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Darba apraksts</label>
                        <textarea
                            name="description"
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
                                name="budget"
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
                                name="deadline_days"
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
