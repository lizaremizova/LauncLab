import React from 'react';
import styles from './MyJobCard.module.css';

import clockIcon from "../../assets/clock.svg";
import doneIcon from "../../assets/doneJob.svg";


const MyJobCard = ({ job, index }) => {
    const cardColors = ['#DBFFB0', '#D2EDF0', '#E3FE8D'];
    const bgColor = cardColors[index % cardColors.length];

    const textColors = ['#cfff90', '#a8f6ff', '#dfff78'];
    const tagColor = textColors[index % textColors.length];

    const isCompleted = job.statuss === 'pabeigts';
    const statusLabel = job.statuss || 'aktīvs';

    return (
        <div className={styles.card} style={{ backgroundColor: bgColor }}>
            <div className={styles.header}>
                <img
                    src={isCompleted ? doneIcon : clockIcon}
                    alt="icon"
                    className={styles.statusIcon}
                />
                <h2 className={styles.title}>{job.nosaukums}</h2>
            </div>

            <div className={styles.detailsGrid}>
                <div className={styles.infoBox}>
                    <span className={styles.badge} style={{color: tagColor}}>termiņš</span>
                    <span className={styles.text}>{job.termina_dienas} dienas</span>
                </div>
                <div className={styles.infoBox} >
                    <span className={styles.badge} style={{color: tagColor}}>publicēja</span>
                    <span className={styles.text}>Jūs</span>
                </div>
                <div className={styles.infoBox}>
                    <span className={styles.badge} style={{color: tagColor}}>budžets</span>
                    <span className={styles.text}>{job.budzets} eur</span>
                </div>
                <div className={styles.infoBox}>
                    <span className={styles.badge} style={{color: tagColor}}>statuss</span>
                    <span className={styles.text}>{statusLabel}</span>
                </div>
            </div>

            <p className={styles.desc}>{job.apraksts}</p>

            <div className={styles.tagRow}>
                {job.kategorijas && job.kategorijas.length > 0 ? (
                    job.kategorijas.map((kat) => (
                        <span key={kat.id} className={styles.tag} style={{color: tagColor}}>
            {kat.nosaukums}
        </span> ))
                ) : (
                    <span className={styles.tag} style={{color: tagColor}}>Nav kategoriju</span>
                )}
            </div>

        </div>
    );
};

export default MyJobCard;
