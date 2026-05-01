import React from 'react';
import styles from "./EmptyCard.module.css";

const EmptyCard = ({ message, buttonText, onAction }) => {
    return (
        <div className={styles.emptyCard}>
            <p>{message}</p>
            <button className={styles.btnBlack} onClick={onAction} >
                {buttonText}
            </button>
        </div>
    );
};

export default EmptyCard;
