import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

export default function Profile() {
    // 1. Get the ID from storage
    const userId = localStorage.getItem('id');

    if (!userId) {
        return <div className={styles.error}>Lietotājs nav atrasts. Lūdzu, ielogojieties.</div>;
    }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('TOKEN')
            await fetch('http://localhost:8080/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
        } catch(error) {
            console.log(error)
        } finally {
            localStorage.removeItem('TOKEN');
            localStorage.removeItem('USER_NAME');
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            window.location.href = '/login';
        }
    }

    return (
        <div className={styles.container}>
            <h1>Mans Profils</h1>
            <p className={styles.userID}>Tavs lietotāja numurs ir: <strong>{userId}</strong></p>
            <Link to="/dashboard">Atpakaļ</Link>
            <button className={styles.logout} onClick={handleLogout}>izrakstīties</button>
        </div>

    );
}
