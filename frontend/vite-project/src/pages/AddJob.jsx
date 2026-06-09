import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AddJob.module.css';
import whiteLogo from "../assets/whiteLogo.png";

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
        const budget = Number(formData.budget);
        const deadlineDays = Number(formData.deadline_days);

        if (!token) {
            alert("Session expired. Please log in again.");
            return;
        }

        if (Number.isNaN(budget) || budget < 0) {
            alert("Budžets nevar būt negatīvs.");
            return;
        }

        if (!Number.isInteger(deadlineDays) || deadlineDays < 1) {
            alert("Termiņam jābūt vismaz 1 dienai.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    budget,
                    deadline_days: deadlineDays
                })
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

            <div className={styles.leftFormSide}>
                <Link to='/dashboard'>
                    <img src={whiteLogo} alt={'logo'} className={styles.logoImg}/>
                </Link>
                <h1>
                    Katrs projekts sākas ar ideju - pievieno savu un atrod īstos cilvēkus tās realizācijai.
                </h1>
            </div>
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
                                min="0"
                                step="0.01"
                                className={styles.deadline_budget}
                                placeholder="0.00"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Termiņš (dienās)</label>
                            <input
                                type="number"
                                name="deadline_days"
                                min="1"
                                step="1"
                                className={styles.deadline_budget}
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
