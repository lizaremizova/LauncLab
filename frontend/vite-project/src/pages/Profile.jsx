import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import Header from "../components/Header/Header.jsx";
import SideBar from "../components/SideBar/SideBar.jsx";
import { useNavigate, useParams } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
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
                </main>
            </div>
        </div>
    );
}
