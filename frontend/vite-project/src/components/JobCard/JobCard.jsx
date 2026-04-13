import React from 'react';
import styles from "./JobCard.module.css";

const JobCard = ({ job, onApply }) => {
    return (
        <div key={job.listing_id} className={styles.jobCard}>

            <div className={styles.jobMain}>

                <h3>{job.name}</h3>

                <p>{job.description?.length > 70
                    ? `${job.description.substring(0, 70)}...`
                    : job.description}</p>

                <div className={styles.tagRow}>

                    {job.categories && job.categories.length > 0 ? (
                        job.categories.map((cat) => (
                            <span key={cat.id} className={styles.tag} >
            {cat.name}
        </span> ))
                    ) : (
                        <span className={styles.tag}>Nav kategoriju</span>
                    )}

                </div>

            </div>

            <div className={styles.jobSide}>

                <div className={styles.jobDetails}>
                    <div className={styles.jobDetail}> <span className={styles.detailTag}>budžets</span>{job.budget} EUR</div>

                    <div className={styles.jobDetail}> <span className={styles.detailTag}>termiņš</span>{job.deadline_days} dienas</div>

                    <div className={styles.jobDetail}> <span className={styles.detailTag}>publicēja</span>{job.username}</div>
                </div>

                <button className={styles.btnBlack} style={{width: '100%', marginTop: '10px'}} onClick={onApply}>Pieteikties</button>

            </div>
        </div>
    );
};

export default JobCard;

