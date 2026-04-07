import React from 'react';
import styles from "./JobCard.module.css";

const JobCard = ({ job, onApply }) => {
    return (
        <div key={job.id} className={styles.jobCard}>

            <div className={styles.jobMain}>

                <h3>{job.nosaukums}</h3>

                <p>{job.apraksts?.length > 70
                    ? `${job.apraksts.substring(0, 70)}...`
                    : job.apraksts}</p>

                <div className={styles.tagRow}>

                    {job.kategorijas && job.kategorijas.length > 0 ? (
                        job.kategorijas.map((kat) => (
                            <span key={kat.id} className={styles.tag} >
            {kat.nosaukums}
        </span> ))
                    ) : (
                        <span className={styles.tag}>Nav kategoriju</span>
                    )}

                </div>

            </div>

            <div className={styles.jobSide}>

                <div className={styles.jobDetails}>
                    <div className={styles.jobDetail}> <span className={styles.detailTag}>budžets</span>{job.budzets} EUR</div>

                    <div className={styles.jobDetail}> <span className={styles.detailTag}>termiņš</span>{job.termina_dienas} dienas</div>

                    <div className={styles.jobDetail}> <span className={styles.detailTag}>publicēja</span>{'BrandFlow'}</div>
                </div>

                <button className={styles.btnBlack} style={{width: '100%', marginTop: '10px'}} onClick={() => onApply(job.id)}>Pieteikties</button>

            </div>
        </div>
    );
};

export default JobCard;

