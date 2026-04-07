import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

import projectsIcon from "../assets/projects.svg";
import clockIcon from "../assets/clock.svg";
import doneIcon from "../assets/doneJob.svg";

import EmptyCard from "../components/EmptyCard/EmptyCard.jsx"
import JobCard from "@/components/JobCard/JobCard.jsx";
import SideBar from "@/components/SideBar/SideBar.jsx";
import Header from "../components/Header/Header.jsx"
import MyJobCard from "../components/MyJobCard/MyJobCard.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('USER_NAME') || "Viesis";

    const [myJobs, setMyJobs] = useState([]);
    const [feedJobs, setFeedJobs] = useState([]);
    const [stats, setStats] = useState({ active: 0, completed: 0, projects: 0 });

    // Feed
    useEffect(() => {
        const myId = localStorage.getItem('id');
        const url = myId
            ? `http://localhost:8080/api/jobs/feed?myId=${myId}`
            : 'http://localhost:8080/api/jobs/feed';

        fetch(url)
            .then(res => res.json())
            .then(data => setFeedJobs(data))
            .catch(err => console.error("Feed fetch failed:", err));
    }, []);

    // YOUR jobs
    useEffect(() => {
        const myId = localStorage.getItem('id');
        if (myId) {
            fetch(`http://localhost:8080/api/user/${myId}/jobs`)
                .then(res => res.json())
                .then(data => {
                    setMyJobs(data);
                    // Update stats based on your jobs
                    const active = data.filter(j => j.statuss === 'aktīvs').length;
                    const completed = data.filter(j => j.statuss === 'pabeigts').length;
                    setStats({ active, completed, projects: data.length });
                })
                .catch(err => console.error('Failed to fetch my jobs:', err));
        }
    }, []);

    const handleApply = (id) => {
        if (!localStorage.getItem('TOKEN')) {
            navigate('/login');
        } else {
            console.log("Applying:", id);
        }
    };

    return (
        <div className={styles.dashboardWrapper}>
            <Header userName={userName} />
            <div className={styles.layoutBody}>
                <SideBar />
                <main className={styles.contentCard}>
                    <section className={styles.sectionHeader}>
                        <h2>Tavi pēdējie pieteikumi</h2>
                        <div className={styles.statsRow}>
                            <div className={styles.statBox}>
                                <img src={clockIcon} alt=""/> {stats.active} aktīvie darbi
                            </div>
                            <div className={styles.statBox}>
                                <img src={doneIcon} alt=""/> {stats.completed} pabeigti
                            </div>
                            <div className={styles.statBox}>
                                <img src={projectsIcon} alt=""/> {stats.projects} projekti
                            </div>
                        </div>
                    </section>

                    <EmptyCard
                        message={"Tev pagaidām nav neviena aktīva darba vai projekta"}
                        buttonText={"pieteikties darbam"}
                    />

                    <h2 className={styles.h2applications}>Tavi pēdējie sludinājumi</h2>

                    <div className={styles.mainContent}>

                        {myJobs.length === 0 ? (
                            <EmptyCard
                                message="Tev pagaidām nav neviena sludinājuma"
                                buttonText="pievienot darbu"
                            />
                        ) : (
                            myJobs.map((job, index) => (
                                <MyJobCard
                                    key={job.sludinajumaID}
                                    job={job}
                                    index={index}
                                />
                            ))
                        )}
                    </div>

                    <h3 className={styles.feedTitle}>Darbi, kas varētu tev patikt</h3>

                    <div className={styles.jobsFeed}>
                        {feedJobs.map((job) => (
                            <JobCard
                                key={job.sludinajumaID || job.id}
                                job={job}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
