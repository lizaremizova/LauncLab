import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

import projectsIcon from "../assets/projects.svg";

import clockIcon from "../assets/clock.svg";
import doneIcon from "../assets/doneJob.svg";

import EmptyCard from "../components/EmptyCard/EmptyCard.jsx"
import JobCard from "@/components/JobCard/JobCard.jsx";
import SideBar from "@/components/SideBar/SideBar.jsx";
import Header from "../components/Header/Header.jsx"


const Dashboard = () => {

    const navigate = useNavigate();

    const userName = localStorage.getItem('USER_NAME') || "Viesis";

    const [jobs, setMyJobs] = useState([]);

    const [stats, setStats] = useState({ active: 0, completed: 0, projects: 0 });

    const [feedJobs, setFeedJobs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/jobs/feed')
            .then(res => res.json())
            .then(data => setFeedJobs(data))
            .catch(err => console.error(err));
    }, []);

// 2. Fetch YOUR jobs
    useEffect(() => {
        const myId = localStorage.getItem('id');
        if (myId) {
            fetch(`http://127.0.0.1:8000/api/user/${myId}/jobs`)
                .then(res => res.json())
                .then(data => setMyJobs(data));
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
            <Header userName={userName}>

            </Header>

            <div className={styles.layoutBody}>

                <SideBar>

                </SideBar>


                <main className={styles.contentCard}>

                    <section className={styles.sectionHeader}>

                        <h2>Tavi pēdējie pieteikumi</h2>

                        <div className={styles.statsRow}>

                            <div className={styles.statBox}><img src={clockIcon} alt="" /> {stats.active} aktīvie darbi</div>

                            <div className={styles.statBox}><img src={doneIcon} alt="" /> {stats.completed} pabeigti</div>

                            <div className={styles.statBox}><img src={projectsIcon} alt="" /> {stats.projects} projekts</div>

                        </div>

                    </section>


                    <EmptyCard message={"Tev pagaidām nav neviena aktīva darba vai projekta"} buttonText={"pieteikties darbam"}>

                    </EmptyCard>

                    <h2 className={styles.h2applications}>

                        Tavi pēdējie sludinājumi

                    </h2>

                    <div className={styles.mainContent}>
                        {jobs.length === 0 ? (
                            <EmptyCard
                                message="Tev pagaidām nav neviena sludinājuma"
                                buttonText="pievienot darbu"
                            />
                        ) : (
                            jobs.map(job => (
                                <JobCard key={job.sludinajumaID} job={job} />
                            ))
                        )}
                    </div>



                    <h3 style={{ color: '#888', marginBottom: '20px' }}>Darbi, kas varētu tev patikt</h3>

                    <div className={styles.jobsFeed}>

                        {feedJobs.map((job) => (
                            <JobCard
                                key={job.id}
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
