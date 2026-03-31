import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

export default function Profile() {
    // 1. Get the ID from storage
    const userId = localStorage.getItem('id');

    if (!userId) {
        return <div className={styles.error}>Lietotājs nav atrasts. Lūdzu, ielogojieties.</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Mans Profils</h1>
            <p>Tavs lietotāja numurs ir: <strong>{userId}</strong></p>
            <Link to="/dashboard">Atpakaļ</Link>
        </div>
    );
}
