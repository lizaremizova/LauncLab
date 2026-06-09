import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./MyListings.module.css";
import Header from "../components/Header/Header.jsx";
import SideBar from "../components/SideBar/SideBar.jsx";
import EmptyCard from "../components/EmptyCard/EmptyCard.jsx";
import { FileUpload } from 'primereact/fileupload';
import Loader from "../components/base/Loader/Loader.jsx";

const API_BASE = "http://localhost:8080/api";
const API_ORIGIN = API_BASE.replace(/\/api$/, "");

const STATUS_ACTIVE = "aktīvs";
const STATUS_IN_PROGRESS = "procesa";
const STATUS_COMPLETED = "pabeigts";
const STATUS_PENDING = "gaida apstiprinājumu";
const STATUS_APPROVED = "apstiprināts";
const STATUS_REJECTED = "noraidīts";

const MyListings = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("USER_NAME") || "Viesis";
    const myId = localStorage.getItem("id");
    const token = localStorage.getItem("TOKEN");

    const [myJobs, setMyJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);

    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [jobsError, setJobsError] = useState("");
    const [applicantsError, setApplicantsError] = useState("");
    const [approvingId, setApprovingId] = useState(null);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const [refreshingApplicants, setRefreshingApplicants] = useState(false);

    const selectedJobId = selectedJob?.id;

    const normalizeApplicantStatus = (status) => {
        if (typeof status !== "string") return status;
        // Backend may return proper UTF-8 "gaida apstiprinājumu" while some UI checks are still mojibake.
        const s = status.toLowerCase();
        if (s.includes("gaida") && s.includes("apstiprin")) return STATUS_PENDING;
        if (s.includes("apstiprin") && !s.includes("gaida")) return STATUS_APPROVED;
        if (s.includes("noraid")) return STATUS_REJECTED;
        return status;
    };

    const isPending = (status) => normalizeApplicantStatus(status) === STATUS_PENDING;
    const isApproved = (status) => normalizeApplicantStatus(status) === STATUS_APPROVED;

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState(STATUS_ACTIVE);

    const statusOptions = useMemo(() => {
        const base = [
            { value: STATUS_ACTIVE, label: "aktīvs" },
            { value: STATUS_IN_PROGRESS, label: "procesā" },
            { value: STATUS_COMPLETED, label: "pabeigts" },
        ];

        if (editStatus && !base.some((o) => o.value === editStatus)) {
            return [{ value: editStatus, label: editStatus }, ...base];
        }

        return base;
    }, [editStatus]);

    useEffect(() => {
        if (!myId) {
            setJobsError("User ID not found");
            setLoadingJobs(false);
            return;
        }

        fetch(`${API_BASE}/user/${myId}/listings`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`HTTP ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => {
                const jobs = Array.isArray(data) ? data : [];
                setMyJobs(jobs);
                setSelectedJob(jobs.length > 0 ? jobs[0] : null);
            })
            .catch((err) => {
                console.error("Failed to fetch jobs:", err);
                setJobsError("Failed to load listings");
            })
            .finally(() => {
                setLoadingJobs(false);
            });
    }, [myId]);

    useEffect(() => {
        setIsEditing(false);
    }, [selectedJobId]);

    useEffect(() => {
        if (!selectedJob || !token) {
            setApplicants([]);
            return;
        }

        setLoadingApplicants(true);
        setApplicantsError("");

        fetch(`${API_BASE}/listings/${selectedJobId}/applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`HTTP ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => {
                const rows = Array.isArray(data) ? data : [];
                setApplicants(rows.map((a) => ({ ...a, status: normalizeApplicantStatus(a.status) })));
            })
            .catch((err) => {
                console.error("Applicants fetch failed:", err);
                setApplicantsError("Neizdevās ielādēt pieteikumus");
            })
            .finally(() => {
                setLoadingApplicants(false);
            });
    }, [selectedJobId, token]);

    const refreshApplicants = async () => {
        if (!selectedJob || !token) return;
        try {
            setRefreshingApplicants(true);
            setApplicantsError("");
            const res = await fetch(`${API_BASE}/listings/${selectedJobId}/applications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`);
            }
            const data = await res.json();
            const rows = Array.isArray(data) ? data : [];
            setApplicants(rows.map((a) => ({ ...a, status: normalizeApplicantStatus(a.status) })));
        } catch (e) {
            console.error(e);
            setApplicantsError("Neizdevās ielādēt pieteikumus");
        } finally {
            setRefreshingApplicants(false);
        }
    };

    const downloadWithAuth = async (apiPath, fallbackName) => {
        if (!apiPath) return;
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`${API_ORIGIN}${apiPath}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`);
            }

            const blob = await res.blob();
            const cd = res.headers.get("content-disposition") || "";
            const m = cd.match(/filename=\"?([^\";]+)\"?/i);
            const filename = m?.[1] || fallbackName || "download";
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Neizdevās lejupielādēt failu");
        }
    };

    const handleApprove = async (applicationId) => {
        try {
            setApprovingId(applicationId);
            const res = await fetch(`${API_BASE}/applications/${applicationId}/approve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Approve failed");
            }

            setApplicants((prev) =>
                prev.map((app) =>
                    app.application_id === applicationId
                        ? { ...app, status: STATUS_APPROVED }
                        : isPending(app.status)
                            ? { ...app, status: STATUS_REJECTED }
                            : app
                )
            );

            setMyJobs((prev) =>
                prev.map((job) =>
                    job.id === selectedJobId
                        ? { ...job, statuss: STATUS_IN_PROGRESS }
                        : job
                )
            );

            setSelectedJob((prev) => (prev ? { ...prev, statuss: STATUS_IN_PROGRESS } : prev));
        } catch (err) {
            console.error("Approve failed:", err);
            alert("Neizdevās apstiprināt pieteikumu");
        } finally {
            setApprovingId(null);
        }
    };

    const startEdit = () => {
        if (!selectedJob) return;
        setEditName(selectedJob.name ?? "");
        setEditDescription(selectedJob.description ?? "");
        setEditStatus(selectedJob.statuss ?? STATUS_ACTIVE);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const updateListingRequest = async () => {
        if (!selectedJob) return;
        if (!token) {
            navigate("/login");
            return;
        }

        const payload = {
            name: editName.trim(),
            description: editDescription.trim(),
            statuss: editStatus,
        };

        if (!payload.name || !payload.description) {
            alert("Aizpildi nosaukumu un aprakstu.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/listings/${selectedJobId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorRes = await response.json().catch(() => null);
                console.error("Update listing error:", errorRes);
                alert("Update failed: " + (errorRes?.message || "Check input data"));
                return;
            }

            const result = await response.json();
            const updated = result?.data ?? {};

            setMyJobs((prev) =>
                prev.map((job) =>
                    job.id === selectedJobId
                        ? {
                            ...job,
                            name: updated.name ?? payload.name,
                            description: updated.description ?? payload.description,
                            statuss: updated.statuss ?? payload.statuss,
                        }
                        : job
                )
            );

            setSelectedJob((prev) =>
                prev
                    ? {
                        ...prev,
                        name: updated.name ?? payload.name,
                        description: updated.description ?? payload.description,
                        statuss: updated.statuss ?? payload.statuss,
                    }
                    : prev
            );

            setIsEditing(false);
        } catch (error) {
            console.error("Network Error:", error);
            alert("Network error. Try again later.");
        }
    };

    const uploadAttachment = async (event) => {
        const file = event.files?.[0];

        if (!file) return;
        if (!selectedJob) {
            alert("Nav izvēlēts sludinājums.");
            return;
        }
        if (!token) {
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("attachment", file);

        try {
            setUploadingAttachment(true);
            const res = await fetch(`${API_BASE}/listings/${selectedJobId}/attachment`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Upload failed");
            }

            setMyJobs((prev) =>
                prev.map((job) =>
                    job.id === selectedJobId
                        ? {
                            ...job,
                            attachment_name: data.data.attachment_name,
                            attachment_mime: data.data.attachment_mime,
                            attachment_size: data.data.attachment_size,
                            attachment_url: data.data.attachment_url,
                        }
                        : job
                )
            );

            setSelectedJob((prev) =>
                prev
                    ? {
                        ...prev,
                        attachment_name: data.data.attachment_name,
                        attachment_mime: data.data.attachment_mime,
                        attachment_size: data.data.attachment_size,
                        attachment_url: data.data.attachment_url,
                    }
                    : prev
            );

            alert("Fails augšupielādēts!");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Neizdevās augšupielādēt failu.");
        } finally {
            setUploadingAttachment(false);
        }
    };

    const handleDelete = async (listingId) => {
        const token = localStorage.getItem('TOKEN');

        if (!confirm("Vai tiešām dzēst sludinājumu?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/listings/${listingId}/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Delete failed');
            }

            setMyJobs(prev => prev.filter(job => job.id !== listingId));

            if (selectedJob?.id === listingId) {
                setSelectedJob(null);
            }

        } catch (err) {
            console.error(err);
            alert("Neizdevās dzēst sludinājumu");
        }
    };

    return (
        <div className={styles.dashboardWrapper}>
            <Header userName={userName} />
            <div className={styles.layoutBody}>
                <SideBar />

                <main className={styles.contentCard}>
                    <h1 className={styles.pageTitle}>Mani sludinājumi</h1>

                    {loadingJobs && <Loader label="Ielādē sludinājumus..." />}
                    {jobsError && <p>{jobsError}</p>}

                    {!loadingJobs && !jobsError && myJobs.length === 0 && (
                        <EmptyCard message="Tev pagaidām nav neviena sludinājuma" buttonText="pievienot darbu" />
                    )}

                    {!loadingJobs && !jobsError && myJobs.length > 0 && (
                        <>
                            <div className={styles.jobTabs}>
                                {myJobs.map((job) => (
                                    <button
                                        key={job.id}
                                        className={`${styles.jobTab} ${
                                            selectedJob?.id === job.id ? styles.activeTab : ""
                                        }`}
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        {job.name}
                                    </button>
                                ))}
                            </div>

                            {selectedJob && (
                                <div className={styles.detailsCard}>
                                    <div className={styles.leftColumn}>
                                        <h2 className={styles.sectionTitle}>Tavs sludinājums</h2>

                                        {isEditing ? (
                                            <input
                                                className={styles.listingTitle}
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            <h3 className={styles.listingTitle}>{selectedJob.name}</h3>
                                        )}

                                        {isEditing ? (
                                            <textarea
                                                className={styles.description}
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                            />
                                        ) : (
                                            <p className={styles.description}>{selectedJob.description}</p>
                                        )}

                                        <div className={styles.metaList}>
                                            <div className={styles.metaRow}>
                                                <span className={styles.metaBadge}>publicēja</span>
                                                <span>Jūs</span>
                                            </div>

                                            <div className={styles.metaRow}>
                                                <span className={styles.metaBadge}>publicēts</span>
                                                <span>{selectedJob.publication_date || "—"}</span>
                                            </div>

                                            <div className={styles.metaRow}>
                                                <span className={styles.metaBadge}>budžets</span>
                                                <span>{selectedJob.budget} eur</span>
                                            </div>

                                            <div className={styles.metaRow}>
                                                <span className={styles.metaBadge}>termiņš</span>
                                                <span>{selectedJob.deadline_days} dienas</span>
                                            </div>

                                            <div className={styles.metaRow}>
                                                <span className={styles.metaBadge}>statuss</span>
                                                {isEditing ? (
                                                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className={styles.selectOption}>
                                                        {statusOptions.map((o) => (
                                                            <option key={o.value} value={o.value}>
                                                                {o.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span>{selectedJob.statuss}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.tagsRow}>
                                            {selectedJob.categories?.length > 0 ? (
                                                selectedJob.categories.map((cat) => (
                                                    <span key={cat.id} className={styles.tag}>
                                                        {cat.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className={styles.tag}>Nav kategoriju</span>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", gap: "1rem" }}>
                                            {isEditing ? (
                                                <>
                                                    <button className={styles.saveButton} onClick={updateListingRequest}>
                                                        saglabāt
                                                    </button>
                                                    <button className={styles.delButton} onClick={cancelEdit}>
                                                        atcelt
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className={styles.saveButton} onClick={startEdit}>
                                                        rediģēt
                                                    </button>
                                                    <button
                                                        className={styles.delButton}
                                                        onClick={() => handleDelete(selectedJobId)}
                                                    >
                                                        dzēst
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        <h2 style={{fontWeight: '400', fontSize: '1.9rem', marginTop: '3rem'}}>Materialu pievienošana darba izpildei</h2>
                                        <FileUpload
                                            mode="basic"
                                            name="attachment"
                                            maxFileSize={10000000}
                                            customUpload
                                            uploadHandler={uploadAttachment}
                                            auto
                                            chooseLabel="Pievienot failu"
                                            className={styles.upload}
                                            disabled={uploadingAttachment}
                                        />
                                        {uploadingAttachment && <Loader label="Augšupielādē failu..." />}
                                    </div>

                                    <div className={styles.rightColumn}>
                                        <div className={styles.sectionHeaderRow}>
                                            <h2 className={styles.sectionTitle}>Pieteikumi</h2>
                                            <button
                                                className={styles.refreshButton}
                                                onClick={refreshApplicants}
                                                disabled={loadingApplicants || refreshingApplicants}
                                                type="button"
                                            >
                                                {refreshingApplicants ? "…" : "atsvaidzināt"}
                                            </button>
                                        </div>

                                        {loadingApplicants && <Loader label="Ielādē pieteikumus..." />}
                                        {applicantsError && <p>{applicantsError}</p>}

                                        {!loadingApplicants && !applicantsError && applicants.length === 0 && (
                                            <p>Šim sludinājumam vēl nav pieteikumu.</p>
                                        )}

                                        {!loadingApplicants && !applicantsError && applicants.length > 0 && (
                                            <div className={styles.applicantsList}>
                                                {applicants.map((applicant) => (
                                                    <div key={applicant.application_id} className={styles.applicantRow}>
                                                        <div className={styles.avatar}></div>

                                                        <div className={styles.applicantInfo}>
                                                            <Link
                                                                to={`/profile/${applicant.user_id}`}
                                                                className={styles.profileLink}
                                                            >
                                                                <div className={styles.username}>@{applicant.username}</div>
                                                                <div className={styles.fullName}>{applicant.name}</div>
                                                            </Link>
                                                        </div>

                                                        {isPending(applicant.status) ? (
                                                            <button
                                                                className={styles.approveButton}
                                                                onClick={() => handleApprove(applicant.application_id)}
                                                                disabled={approvingId === applicant.application_id}
                                                            >
                                                                Apstiprināt
                                                            </button>
                                                        ) : (
                                                            <div className={styles.statusArea}>
                                                                <div
                                                                    className={`${styles.statusDone} ${
                                                                        isApproved(applicant.status)
                                                                            ? styles.statusApproved
                                                                            : styles.statusRejected
                                                                    }`}
                                                                    title={applicant.status}
                                                                >
                                                                    {isApproved(applicant.status) ? "✓" : "×"}
                                                                </div>

                                                                {applicant.result_url ? (
                                                                    <button
                                                                        className={styles.resultLink}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            downloadWithAuth(
                                                                                applicant.result_url,
                                                                                applicant.result_name || "result"
                                                                            )
                                                                        }
                                                                    >
                                                                        rezultāts
                                                                    </button>
                                                                ) : (
                                                                    isApproved(applicant.status) && (
                                                                        <span className={styles.resultPending}>
                                                                            gaida rezultātu
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyListings;
