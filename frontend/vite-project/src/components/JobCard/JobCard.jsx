import React from 'react';
import styles from "./JobCard.module.css";

const JobCard = ({ job, onApply }) => {
    return (
        <div key={job.id} className={styles.jobCard}>

            <div className={styles.jobMain}>

                <h3>{job.nosaukums}</h3>

                <p>{job.apraksts}</p>

                <div className={styles.tagRow}>

                    <span className={styles.tag}>react</span>

                    <span className={styles.tag}>tailwind</span>

                </div>

            </div>

            <div className={styles.jobSide}>

                <div className={styles.jobDetail}>budžets <strong>{job.budzets} EUR</strong></div>

                <div className={styles.jobDetail}>termiņš <strong>{job.termina_dienas} dienas</strong></div>

                <button className={styles.btnBlack} style={{width: '100%', marginTop: '10px'}} onClick={() => onApply(job.id)}>Pieteikties</button>

            </div>
        </div>
    );
};

export default JobCard;

