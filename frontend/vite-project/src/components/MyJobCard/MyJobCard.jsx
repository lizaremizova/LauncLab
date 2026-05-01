import React from 'react';
import styles from './MyJobCard.module.css';

import clockIcon from "../../assets/clock.svg";
import doneIcon from "../../assets/doneJob.svg";


const MyJobCard = ({ job, index, isApplication, onClick }) => {
    const cardColors = ['#e7ffe3', '#D2EDF0', '#E3FE8D'];
    const bgColor = cardColors[index % cardColors.length];

    const textColors = ['#d7ffcd', '#a8f6ff', '#dfff78'];
    const tagColor = textColors[index % textColors.length];

    const isCompleted = job.statuss === 'pabeigts';
    const statusLabel = job.statuss || 'aktīvs';

    const displayAuthor = job.author_name || (isApplication ? "Autors" : "Jūs");

    return (
        <div
            className={`${styles.card} ${onClick ? styles.clickable : ""}`}
            style={{ backgroundColor: bgColor }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") onClick();
                    }
                    : undefined
            }
        >
            <div className={styles.header}>
                <img
                    src={isCompleted ? doneIcon : clockIcon}
                    alt="icon"
                    className={styles.statusIcon}
                />
                <h2 className={styles.title}>{job.name}</h2>
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.infoBox}>
                    <span className={styles.badge} style={{color: tagColor}}>termiņš</span>
                    <span className={styles.text}>{job.deadline_days} dienas</span>
                </div>
                <div className={styles.infoBox} >
                    <span className={styles.badge} style={{color: tagColor}}>publicēja</span>
                    <span className={styles.text}>{displayAuthor}</span>
                </div>
                <div className={styles.infoBox}>
                    <span className={styles.badge} style={{color: tagColor}}>budžets</span>
                    <span className={styles.text}>{job.budget} eur</span>
                </div>
                <div className={styles.infoBox}>
                    <span className={styles.badge} style={{color: tagColor}}>statuss</span>
                    <span className={styles.text}>{statusLabel}</span>
                </div>
            </div>

            <p className={styles.desc}>{job.description}</p>

            <div className={styles.tagRow}>
                {job.categories && job.categories.length > 0 ? (
                    job.categories.map((cat) => (
                        <span key={cat.id} className={styles.tag} style={{color: tagColor}}>
            {cat.name}
        </span> ))
                ) : (
                    <span className={styles.tag} style={{color: tagColor}}>Nav kategoriju</span>
                )}
            </div>

        </div>
    );
};

export default MyJobCard;
