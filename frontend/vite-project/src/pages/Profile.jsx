import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import Header from "../components/Header/Header.jsx";
import SideBar from "../components/SideBar/SideBar.jsx";

export default function Profile() {
    const [pfp, setPfp] = useState(null);
    const [user, setUser] = useState(null);

    const userId = localStorage.getItem('USER_ID') || localStorage.getItem('id');
    const token = localStorage.getItem('TOKEN');

    // if (!userId || !token) {
    //     return <div className={styles.error}>Lietotājs nav atrasts. Lūdzu, ielogojieties.</div>;
    // }

    useEffect(() => {
        fetch('http://localhost:8080/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
            })
            .catch(err => console.log(err));
    }, [token]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/api/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        const savedAvatar = localStorage.getItem('USER_AVATAR');
        if (savedAvatar) {
            setPfp(savedAvatar);
        }

        const handleAvatarUpdate = () => {
            setPfp(localStorage.getItem('USER_AVATAR'));
        };

        window.addEventListener("avatarUpdated", handleAvatarUpdate);
        return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.dashboardWrapper}>
            <Header userName={user.username} />
            <div className={styles.layoutBody}>
                <SideBar />
                <main className={styles.contentCard}>
                    <section className={styles.sectionHeader}>
                        <h2>@{user.username} profils</h2>
                        <button className={styles.logout} onClick={handleLogout}>
                            izrakstīties
                        </button>
                    </section>

                    <div className={styles.profileInfo}>
                        <img
                            src={pfp}
                            alt="tavs profila attēls"
                            className={styles.pfp}
                        />
                        <div>
                            <p>@{user.username}</p>
                            <p>{user.name}</p>
                            <p>{user.bio}</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
