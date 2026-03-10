import React, { useEffect, useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css'
import logo from "../assets/LaunchlabLogo.png"
import search from '../assets/search.svg'
import settings from "../assets/settings.svg"
import reactlogo from "../assets/react.svg"
const Dashboard = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('TOKEN');
    const userName = localStorage.getItem('USER_NAME') || "Viesi";

    const handleApply = (jobId) => {
        if (!isLoggedIn) {

            alert("Lūdzu, pierakstieties, lai pieteiktos!");
            navigate('/login');
        } else {
            console.log("Applying for:", jobId);
        }
    };

    const [jobs, setJobs] = useState([]);

    useEffect(() => {

        fetch('http://localhost:8000/api/jobs/feed')
            .then(response => response.json())
            .then(data => {

                setJobs(data);
            })
            .catch(error => console.error('Error fetching jobs:', error));
    }, []);

    return (
        <section>
            <header>
            <div className={styles.headerLeft}>
                <Link to="/Home" className={styles.logoDashboard}>
                    <img src={logo}/>
                </Link>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="meklēt..."
                        />
                        <button className={styles.searchBtn}>
                            <img src={search} alt="Search" className={styles.searchIconImg} />
                        </button>
                </div>
            </div>
                <div className={styles.headerRight}>
                    <Link to="" className={styles.applyHeader}>pieteikties darbam</Link>
                    <Link to="" className={styles.postHeader}>pievienot darbu</Link>
                    <div className={styles.profileLink}>
                        <img src={settings} />
                        <p>{userName}</p>
                        <img src={reactlogo}/>
                    </div>
                </div>
            </header>





            <div className="dashboardContainer">
                <h1>Sveiki, {userName}!</h1>
                <h2>Darbi, kas varētu tev patikt</h2>

                <div className="jobsFeed">
                    {jobs.map((job, index) => (
                        <div key={index} className="job-card">
                            <div className="job-header">
                                <h3>{job.nosaukums}</h3>
                                <span className="budget">{job.budzets} EUR</span>
                            </div>
                            <p>{job.apraksts}</p>
                            <div className="job-footer">
                                <span>Termiņš: {job.termina_dienas} dienas</span>
                                <button className="apply-btn">Pieteikties</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleApply(job.id)}>Pieteikties</button>
            </div>
        </section>

    );
};

export default Dashboard;
