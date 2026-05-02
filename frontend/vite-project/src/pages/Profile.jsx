import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import Header from "../components/Header/Header.jsx";
import SideBar from "../components/SideBar/SideBar.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { Chart } from 'primereact/chart';

const API_BASE = "http://localhost:8080/api";

const buildCategoryUsage = (listings) => {
    const counts = new Map();

    for (const listing of listings || []) {
        const categories = Array.isArray(listing?.categories) ? listing.categories : [];
        for (const cat of categories) {
            const name = (cat?.name || "").trim();
            if (!name) continue;
            counts.set(name, (counts.get(name) || 0) + 1);
        }
    }

    return Array.from(counts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export default function Profile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const token = localStorage.getItem('TOKEN');

    const fetchUserData = () => {
        if (!token) return;

        const url = userId
            ? `http://localhost:8080/api/users/${userId}`
            : 'http://localhost:8080/api/user';

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                // Sync localstorage only for "my profile" view.
                if (!userId) {
                    localStorage.setItem('USER_AVATAR', data.avatar_url);
                    localStorage.setItem('description', data.description);
                }
            })
            .catch(err => console.error("Refresh failed:", err));
    };

    useEffect(() => {
        fetchUserData();
        const handleUpdate = () => fetchUserData();
        window.addEventListener("avatarUpdated", handleUpdate);

        return () => window.removeEventListener("avatarUpdated", handleUpdate);
    }, [token]);

    useEffect(() => {
        const effectiveUserId = userId || user?.id || localStorage.getItem("id");
        if (!effectiveUserId) return;

        setLoadingListings(true);
        fetch(`${API_BASE}/user/${effectiveUserId}/listings`, {
            headers: { Accept: "application/json" },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`HTTP ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => setListings(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("Failed to fetch user listings:", err);
                setListings([]);
            })
            .finally(() => setLoadingListings(false));
    }, [userId, user?.id]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            localStorage.clear();
            navigate('/login');
        }
    };

    if (!user) {
        return <div className={styles.loading}>Ielādē...</div>;
    }

    const usageRows = buildCategoryUsage(listings);
    const usageLabels = usageRows.map((r) => r.name);
    const usageValues = usageRows.map((r) => r.count);

    const chartData = {
        labels: usageLabels,
        datasets: [
            {
                data: usageValues,
                backgroundColor: [
                    "#E9FFCF",
                    "#E3FE8D",
                    "#D2EDF0",
                    "#DBFFB0",
                    "#d7f4ff",
                    "#fff5c8",
                    "#adf8ff",
                    "#cde1ff",
                    "#e4ffad",
                    "#84CC16",
                ],
                borderColor: "#FFFFFF",
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        cutout: "70%",
        plugins: {
            legend: {
                position: "right",
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    padding: 14,
                },
            },
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    return (
        <div className={styles.dashboardWrapper}>
            <Header userName={user.username} />
            <div className={styles.layoutBody}>
                <SideBar />
                <main className={styles.contentCard}>
                    <section className={styles.sectionHeader}>
                        <h2>@{user.username} profils</h2>
                        {!userId && (
                            <button className={styles.logout} onClick={handleLogout}>
                                izrakstīties
                            </button>
                        )}
                    </section>

                    <div className={styles.profileInfo}>
                        <img
                            src={user.avatar_url}
                            alt="tavs profila attēls"
                            className={styles.pfp}
                        />
                        <div className={styles.UserInfo}>
                            <p>@{user.username}</p>
                            <p>{user.name}</p>
                            <p className={styles.bioProfile}>{user.description}</p>
                        </div>
                    </div>

                    <section className={styles.categoryUsageSection}>
                        <div className={styles.categoryUsageHeader}>
                            <h3 className={styles.categoryUsageTitle}>Kategoriju lietojums</h3>
                            {loadingListings ? (
                                <span className={styles.categoryUsageMeta}>Lāde...</span>
                            ) : (
                                <span className={styles.categoryUsageMeta}>
                                    {usageRows.length ? `${listings.length} sludinājumi` : "Nav katejoriju datu"}
                                </span>
                            )}
                        </div>

                        {usageRows.length ? (
                            <div className={styles.categoryUsageChartWrap}>
                                <Chart type="doughnut" data={chartData} options={chartOptions} />
                            </div>
                        ) : null}
                    </section>
                </main>
            </div>
        </div>
    );
}
