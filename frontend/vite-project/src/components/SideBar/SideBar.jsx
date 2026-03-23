import React from 'react';
import styles from "./SideBar.module.css";
import {Link} from "react-router-dom";
import homeIcon from "@/assets/home.svg";
import projectsIcon from "@/assets/projects.svg";
import chatIcon from "@/assets/chat.svg";
import jobIcon from "@/assets/job.svg";

const SideBar = () => {
    return (
        <aside className={styles.sidebar}>

            <Link to="/dashboard" className={`${styles.navItem} ${styles.navItemActive}`}>

                <img src={homeIcon} alt="" /> <span>panelis</span>

                <div className={styles.activeDot}></div>

            </Link>

            <Link to="/projects" className={styles.navItem}><img src={projectsIcon} alt="" /> <span>projekti</span></Link>

            <Link to="/chat" className={styles.navItem}><img src={chatIcon} alt="" /> <span>sarakste</span></Link>

            <Link to="/jobs" className={styles.navItem}><img src={jobIcon} alt="" /> <span>darbi</span></Link>

        </aside>
    );
};

export default SideBar;
