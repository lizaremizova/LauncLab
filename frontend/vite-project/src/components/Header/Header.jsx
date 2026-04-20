import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';

import logo from '../../assets/LaunchlabLogo.png';
import searchIcon from "@/assets/search.svg";
import settingsIcon from "@/assets/settings.svg";
import reactLogo from "@/assets/react.svg";
export default function Header({ userName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(localStorage.getItem('USER_AVATAR') || reactLogo);

    const userDisplay = {
        name: localStorage.getItem('name') || "Vārds",
        username: userName || "Lietotājs",
        bio: localStorage.getItem('description') || "Nav apraksta"
    };

    useEffect(() => {
        const handleUpdate = () => {
            setPreviewImage(localStorage.getItem('USER_AVATAR'));
        };
        window.addEventListener("avatarUpdated", handleUpdate);
        return () => window.removeEventListener("avatarUpdated", handleUpdate);
    }, []);

    const customBase64Uploader = async (event) => {
        const file = event.files[0];
        const reader = new FileReader();
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('TOKEN');

        let blob = await fetch(file.objectURL).then((r) => r.blob());
        reader.readAsDataURL(blob);

        reader.onloadend = async function () {
            const base64data = reader.result;
            setPreviewImage(base64data);

            try {
                const response = await fetch(`http://localhost:8080/api/user/${userId}/avatar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ avatar: base64data })
                });

                if (response.ok) {
                    localStorage.setItem('USER_AVATAR', base64data);
                    window.dispatchEvent(new Event("avatarUpdated"));
                }
            } catch (error) {
                console.error("Network Error:", error);
            }
        };
    };

    return (
        <header className={styles.mainHeader}>

            <div className={styles.headerLeft}>
                <div className={styles.logoPill}>
                    <img src={logo} className={styles.logoImg} alt="Logo" />
                </div>
                <div className={styles.searchWrapper}>
                    <input type="text" className={styles.searchInput} placeholder="meklēt..." />
                    <button className={styles.searchBtn}>
                        <img src={searchIcon} alt="Search" className={styles.searchIconImg} />
                    </button>
                </div>
            </div>


            <div className={styles.headerRight}>
                <Link to="/apply" className={styles.btnBlack}>pieteikties darbam</Link>
                <Link to="/post" className={styles.btnLime}>pievienot darbu</Link>

                <div className={styles.profilePill}>
                    {userName !== "Viesis" ? (
                        <>
                            <img
                                src={settingsIcon}
                                alt="Settings"
                                onClick={() => setIsModalOpen(true)}
                                style={{ cursor: 'pointer' }}
                            />
                            <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
                                <span>{userName}</span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/login" className={styles.loginLink}>Ienākt</Link>
                    )}
                    <img src={previewImage} className={styles.avatar} alt="Profile" />
                </div>
            </div>

            <Dialog
                header="Tava profila dati"
                visible={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                className={styles.popup}
            >
                <div className={styles.modalContent}>
                    <div className={styles.profileInfo}>
                        <img
                            src={previewImage}
                            alt="tavs profila attēls"
                            className={styles.pfp}
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                            <p>@{userDisplay.username}</p>
                            <p>{userDisplay.name}</p>
                            <p>{userDisplay.bio}</p>
                        </div>
                    </div>

                    <h3>Mainīt profila attēlu</h3>
                    <FileUpload
                        mode="basic"
                        name="avatar"
                        accept="image/*"
                        maxFileSize={1000000}
                        customUpload
                        uploadHandler={customBase64Uploader}
                        auto
                        chooseLabel="Izvēlēties attēlu"
                    />
                </div>
            </Dialog>
        </header>
    );
}
