import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AddJob.module.css';
import logo from "../assets/LaunchlabLogo.png";

const AddJob = () => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        nosaukums: '',
        apraksts: '',
        budzets: '',
        termina_dienas: '',
        kategorijas: []
    });


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                const data = await response.json();
                console.log("Categories loaded:", data);
                setCategories(data);
            } catch (err) {
                console.error("Fetch error:", err);
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
                console.error("Server rejected request:", errorData);
                alert("Server error: " + (errorData.message || "Unknown error"));
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
                        <label>Kategorijas</label>

                        <div className={styles.dropdownWrapper}>
                            <button
                                type="button"
                                className={styles.dropdownButton}
                                onClick={() => setIsCategoryOpen(prev => !prev)}
                            >
                                {formData.kategorijas.length > 0
                                    ? categories
                                        .filter(kat => formData.kategorijas.includes(kat.id))
                                        .map(kat => kat.nosaukums)
                                        .join(', ')
                                    : 'Izvēlieties kategorijas'}
                            </button>

                            {isCategoryOpen && (
                                <div className={styles.dropdownMenu}>
                                    {categories.map(kat => (
                                        <label key={kat.id} className={styles.dropdownItem}>
                                            <input
                                                type="checkbox"
                                                checked={formData.kategorijas.includes(kat.id)}
                                                onChange={() => {
                                                    setFormData(prev => {
                                                        const alreadySelected = prev.kategorijas.includes(kat.id);

                                                        return {
                                                            ...prev,
                                                            kategorijas: alreadySelected
                                                                ? prev.kategorijas.filter(id => id !== kat.id)
                                                                : [...prev.kategorijas, kat.id]
                                                        };
                                                    });
                                                }}
                                            />
                                            <span>{kat.nosaukums?.length > 20
                                                ? `${kat.nosaukums.substring(0, 20)}...`
                                                : kat.nosaukums}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
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
