import React from 'react';
import styles from "./SideBar.module.css";
import {Link} from "react-router-dom";
import homeIcon from "@/assets/home.svg";
import projectsIcon from "@/assets/projects.svg";
import chatIcon from "@/assets/chat.svg";
import jobIcon from "@/assets/job.svg";
import myListings from "@/assets/applicants.svg"
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
                <img src={homeIcon} alt="home icon" />
                <span>panelis</span>
            </NavLink>

            <NavLink
                to="/projects"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={projectsIcon} alt="projects icon" />
                <span>projekti</span>
            </NavLink>

            <NavLink
                to="/chat"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={chatIcon} alt="chat icon" />
                <span>sarakste</span>
            </NavLink>

            <NavLink
                to="/jobs"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={jobIcon} alt="jobs icon" />
                <span>darbi</span>
            </NavLink>

            <NavLink
                to="/mylistings"
                className={({ isActive }) =>
                    isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
                }
            >
                <img src={myListings} alt="my listings" className={styles.navImg} />
                <span>mani slud.</span>
            </NavLink>

        </aside>
    );
};

export default SideBar;
