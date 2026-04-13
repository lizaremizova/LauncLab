import React from 'react';
import styles from "./SideBar.module.css";
import {Link} from "react-router-dom";
import homeIcon from "@/assets/home.svg";
import projectsIcon from "@/assets/projects.svg";
import chatIcon from "@/assets/chat.svg";
import jobIcon from "@/assets/job.svg";
import { NavLink } from "react-router-dom";

const SideBar = () => {
    return (
        <aside className={styles.sidebar}>

            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={homeIcon} alt="" />
                <span>panelis</span>
            </NavLink>

            <NavLink
                to="/projects"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={projectsIcon} alt="" />
                <span>projekti</span>
            </NavLink>

            <NavLink
                to="/chat"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={chatIcon} alt="" />
                <span>sarakste</span>
            </NavLink>

            <NavLink
                to="/jobs"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={jobIcon} alt="" />
                <span>darbi</span>
            </NavLink>

        </aside>
    );
};

export default SideBar;
