import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import logo from "@/assets/LaunchlabLogo.png";
import searchIcon from "@/assets/search.svg";
import settingsIcon from "@/assets/settings.svg";
import reactLogo from "@/assets/react.svg";
import React from "react";

export default function Header({userName}) {
    return (
        <header className={styles.mainHeader}>

            <div className={styles.headerLeft}>

                <div className={styles.logoPill}>

                    <img src={logo} className={styles.logoImg} alt="Logo" />

                </div>

                <div className={styles.searchWrapper}>

                    <input

                        type="text"

                        className={styles.searchInput}

                        placeholder="meklēt..."

                    />

                    <button className={styles.searchBtn}>

                        <img src={searchIcon} alt="Search" className={styles.searchIconImg} />

                    </button>

                </div>



            </div>

            <div className={styles.headerRight}>

                <Link to="/apply" className={styles.btnBlack}>pieteikties darbam</Link>

                <Link to="/post" className={styles.btnLime}>pievienot darbu</Link>

                <div className={styles.profilePill}>

                    <Link to="/profile"> <img src={settingsIcon} alt="Settings" /> </Link>

                    <span>{userName}</span>

                    <img src={reactLogo} className={styles.avatar} alt="Profile" />

                </div>

            </div>

        </header>
    );
}
