import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';

import logo from '../../assets/LaunchlabLogo.png';
import searchIcon from "@/assets/search.svg";
import settingsIcon from "@/assets/settings.svg";
import defaultPfp from "@/assets/profile.png";
export default function Header({ userName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(localStorage.getItem('USER_AVATAR') || defaultPfp);
    const [bio, setBio] = useState(localStorage.getItem('description') || "");
    const [editUsername, setEditUsername] = useState(localStorage.getItem('username') || userName);
    const [editName, setEditName] = useState(localStorage.getItem('name') || "");

    const userDisplay = {
        name: localStorage.getItem('name') || "Vārds",
        username: userName || "Lietotājs",
        bio: localStorage.getItem('description') || "Nav apraksta"
    };

    useEffect(() => {
        const handleUpdate = () => {
            setPreviewImage(localStorage.getItem('USER_AVATAR') || defaultPfp);
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
    const updateInfoRequest = async () => {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('TOKEN');

        try {
            const response = await fetch(`http://localhost:8080/api/user/${userId}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bio: bio,
                    username: editUsername,
                    name: editName
                })
            });

            if (response.ok) {
                const result = await response.json();

                localStorage.setItem('username', result.username);
                localStorage.setItem('name', result.name);
                localStorage.setItem('description', result.bio);

                alert("Profils atjaunināts!");

                window.dispatchEvent(new Event("avatarUpdated"));
                setIsModalOpen(false);
            } else {
                const errorRes = await response.json();
                console.error("Validation error:", errorRes);
                alert("Kļūda: " + (errorRes.message || "Pārbaudiet ievadītos datus"));
            }
        } catch (error) {
            console.error("Network Error:", error);
        }
    };

    useEffect(() => {
        const syncProfile = () => {
            const latestUsername = localStorage.getItem('username');
            if (latestUsername) {
                setEditUsername(latestUsername);
            }
        };

        window.addEventListener("avatarUpdated", syncProfile);
        window.addEventListener("storage", syncProfile);

        return () => {
            window.removeEventListener("avatarUpdated", syncProfile);
            window.removeEventListener("storage", syncProfile);
        };
    }, []);


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
                                <span>{editUsername}</span>
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
                pt={{
                    header: { className: styles.popupHeader },
                    content: { className: styles.popupContent },
                    root: { className: styles.popupRoot }
                }}
            >
                <div className={styles.popupContent}>
                    <div className={styles.profileInfo}>
                        <div className={styles.setPfp}>
                            <img
                                src={previewImage}
                                alt="tavs profila attēls"
                                className={styles.pfp}
                                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <FileUpload
                                mode="basic"
                                name="avatar"
                                accept="image/*"
                                maxFileSize={1000000}
                                customUpload
                                uploadHandler={customBase64Uploader}
                                auto
                                chooseLabel="Izvēlēties attēlu"
                                className={styles.upload}
                            />
                        </div>

                        <div className={styles.info}>
                            <p classname={styles.semiBold} style={{fontWeight: 400}}>@{userDisplay.username}</p>
                            <p className={styles.semiBold}>{userDisplay.name}</p>
                            <p className={styles.bioSettings}>{userDisplay.bio}</p>
                        </div>
                    </div>

                    <div className={styles.usernameUpdate}>
                        <h3>
                            lietotājvārds
                        </h3>
                        <input type="text"
                               placeholder={userDisplay.username}
                               className={styles.modalInput}
                               value={editUsername}
                               onChange={(e) => setEditUsername(e.target.value)}
                        />
                    </div>

                    <div className={styles.usernameUpdate}>
                        <h3>
                            Vārds Uzvards
                        </h3>
                        <input
                            type="text"
                            placeholder={userDisplay.name}
                            className={styles.modalInput}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </div>

                    <div className={styles.bio}>
                        <h3>
                            apraksts
                        </h3>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className={styles.bioInput}
                            placeholder="Pastāsti par sevi..."
                            style={{ width: '100%', height: '80px', marginBottom: '10px' }}
                        />
                        <button
                            onClick={updateInfoRequest}
                            className={styles.btnLime}
                            style={{ width: '100%', marginBottom: '20px', marginTop: '20px' }}
                        >
                            Saglabāt izmaiņas
                        </button>
                    </div>

                </div>
            </Dialog>
        </header>
    );
}
