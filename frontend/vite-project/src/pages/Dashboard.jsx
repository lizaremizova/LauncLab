import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

import projectsIcon from "../assets/projects.svg";
import clockIcon from "../assets/clock.svg";
import doneIcon from "../assets/doneJob.svg";

import EmptyCard from "../components/EmptyCard/EmptyCard.jsx";
import JobCard from "@/components/JobCard/JobCard.jsx";
import SideBar from "@/components/SideBar/SideBar.jsx";
import Header from "../components/Header/Header.jsx";
import MyJobCard from "../components/MyJobCard/MyJobCard.jsx";
import Loader from "../components/base/Loader/Loader.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("USER_NAME") || "Viesis";

    const normalizeStatus = (status) =>
        typeof status === "string" ? status.trim().toLowerCase().normalize("NFC") : "";

    const activeStatuses = new Set(["aktīvs", "aktÄ«vs", "aktÃ„Â«vs", "procesā", "procesa", "procesÄ", "procesÃ„Â"]);
    const completedStatuses = new Set(["pabeigts"]);

    const isActiveStatus = (status) => activeStatuses.has(normalizeStatus(status));
    const isCompletedStatus = (status) => completedStatuses.has(normalizeStatus(status));

    const [currentUserId, setCurrentUserId] = useState(null);

    const [myJobs, setMyJobs] = useState([]);
    const [feedJobs, setFeedJobs] = useState([]);
    const [stats, setStats] = useState({ active: 0, completed: 0, projects: 0 });
    const [myApplications, setMyApplications] = useState([]);

    const [loadingFeed, setLoadingFeed] = useState(true);
    const [loadingMyJobs, setLoadingMyJobs] = useState(true);
    const [loadingMyApps, setLoadingMyApps] = useState(true);

    const normalizeListingsPayload = (payload) => {
        // Backend may return either an array or a Laravel-style wrapper: { data: [...] }
        if (Array.isArray(payload)) return payload;
        if (payload && Array.isArray(payload.data)) return payload.data;
        return [];
    };

    // Resolve user id from token so stale localStorage can't blank the dashboard after reseeding.
    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        const storedId = localStorage.getItem("id");

        // Always set a fallback immediately so the rest of the dashboard can load.
        setCurrentUserId(storedId || null);

        if (!token) return;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        fetch("http://localhost:8080/api/user", {
            signal: controller.signal,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((user) => {
                if (user?.id) {
                    localStorage.setItem("id", user.id);
                    setCurrentUserId(user.id);
                }
            })
            .catch(() => {})
            .finally(() => clearTimeout(timeout));
    }, []);

    // Feed
    useEffect(() => {
        const myId = currentUserId || localStorage.getItem("id");
        const url = myId
            ? `http://localhost:8080/api/listings/feed?myId=${myId}`
            : "http://localhost:8080/api/listings/feed";

        setLoadingFeed(true);
        setFeedJobs([]);

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const rows = normalizeListingsPayload(data);
                setFeedJobs(rows.slice(0, 4));
            })
            .catch((err) => console.error("Feed fetch failed:", err))
            .finally(() => setLoadingFeed(false));
    }, [currentUserId]);

    // Your jobs
    useEffect(() => {
        const myId = currentUserId;
        setLoadingMyJobs(true);

        if (!myId) {
            setMyJobs([]);
            setStats({ active: 0, completed: 0, projects: 0 });
            setLoadingMyJobs(false);
            return;
        }

        fetch(`http://localhost:8080/api/user/${myId}/listings`)
            .then((res) => res.json())
            .then((data) => {
                const rows = normalizeListingsPayload(data);
                setMyJobs(rows);

                const active = rows.filter((j) => isActiveStatus(j.statuss)).length;
                const completed = rows.filter((j) => isCompletedStatus(j.statuss)).length;
                setStats({ active, completed, projects: rows.length });
            })
            .catch((err) => console.error("Failed to fetch my jobs:", err))
            .finally(() => setLoadingMyJobs(false));
    }, [currentUserId]);

    // Your applications
    useEffect(() => {
        const myId = currentUserId;
        setLoadingMyApps(true);

        if (!myId) {
            setMyApplications([]);
            setLoadingMyApps(false);
            return;
        }

        fetch(`http://localhost:8080/api/user/${myId}/applications`)
            .then((res) => res.json())
            .then((data) => setMyApplications(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Failed to fetch my applications:", err))
            .finally(() => setLoadingMyApps(false));
    }, [currentUserId]);

    const handleApply = (id) => {
        if (!localStorage.getItem("TOKEN")) {
            navigate("/login");
            return;
        }
        console.log("Applying:", id);
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
                                <img src={clockIcon} alt="" /> {stats.active} aktīvie darbi
                            </div>
                            <div className={styles.statBox}>
                                <img src={doneIcon} alt="" /> {stats.completed} pabeigti
                            </div>
                            <div className={styles.statBox}>
                                <img src={projectsIcon} alt="" /> {stats.projects} projekti
                            </div>
                        </div>
                    </section>

                    <div className={styles.applicationContainer}>
                        {loadingMyApps ? (
                            <Loader label="Ielādē pieteikumus..." />
                        ) : myApplications.length > 0 ? (
                            myApplications.map((app, index) => (
                                <MyJobCard
                                    key={app.app_id}
                                    index={index}
                                    onClick={() => navigate(`/applications/${app.app_id}`)}
                                    job={{
                                        name: app.job_name,
                                        statuss: app.status,
                                        deadline_days: app.deadline,
                                        budget: app.budget,
                                        description: app.description || "Pieteikums",
                                        categories: app.categories || [],
                                    }}
                                    isApplication={true}
                                />
                            ))
                        ) : (
                            <EmptyCard
                                message={"Tev pagaidām nav neviena pieteikuma"}
                                buttonText={"pieteikties darbam"}
                                onAction={() => navigate("/jobs")}
                            />
                        )}
                    </div>

                    <h2 className={styles.h2applications}>Tavi pēdējie sludinājumi</h2>

                    <div className={styles.mainContent}>
                        {loadingMyJobs ? (
                            <Loader label="Ielādē sludinājumus..." />
                        ) : myJobs.length === 0 ? (
                            <EmptyCard
                                message="Tev pagaidām nav neviena sludinājuma"
                                buttonText="pievienot darbu"
                                onAction={() => navigate("/post")}
                            />
                        ) : (
                            myJobs.map((job, index) => (
                                <MyJobCard
                                    key={job.id || `job-${index}`}
                                    job={job}
                                    index={index}
                                    isApplication={false}
                                    onClick={() => navigate("/mylistings")}
                                />
                            ))
                        )}
                    </div>

                    <h3 className={styles.feedTitle}>Darbi, kas varētu tev patikt</h3>

                    <div className={styles.jobsFeed}>
                        {loadingFeed ? (
                            <Loader label="Ielādē plūsmu..." />
                        ) : feedJobs.length > 0 ? (
                            feedJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onApply={() => handleApply(job.id)}
                                    isApplication={false}
                                />
                            ))
                        ) : (
                            <EmptyCard
                                message={"Pašlaik plūsmā nav darbu"}
                                buttonText={"pievienot darbu"}
                                onAction={() => navigate("/post")}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
