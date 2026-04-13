import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JobsPage.module.css';
import JobCard from "@/components/JobCard/JobCard.jsx";
import SideBar from "@/components/SideBar/SideBar.jsx";
import Header from "@/components/Header/Header.jsx"
import searchIcon from "@/assets/search.svg";
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
const JobsPage = () => {

    const navigate = useNavigate();
    const userName = localStorage.getItem('USER_NAME') || "Viesis";
    const [feedJobs, setFeedJobs] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Feed
    useEffect(() => {
        const myId = localStorage.getItem('id');
        const url = myId
            ? `http://localhost:8080/api/jobs/feed?myId=${myId}`
            : 'http://localhost:8080/api/jobs/feed';

        fetch(url)
            .then(async res => {
                const data = await res.json();
                console.log('feed response:', data);
                if (Array.isArray(data)) {
                    setFeedJobs(data);
                } else {
                    console.error(data);
                    setFeedJobs([]);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleApply = (id) => {
        if (!localStorage.getItem('TOKEN')) {
            navigate('/login');
        } else {
            console.log("Applying:", id);
        }
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const formatted = data.map(c => ({ name: c.name, code: c.id }));
                    setCategories(formatted);
                }
            })
            .catch(err => console.error("API Down:", err));
    }, []);

    const filteredJobs = (feedJobs || []).filter(job => {
        const title = (job?.title || job?.name || "").toLowerCase();
        const desc = (job?.description || "").toLowerCase();
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch = title.includes(search) || desc.includes(search);

        const matchesCategory = selectedCategories.length === 0 ||
            (Array.isArray(job.categories) && job.categories.some(cat =>
                selectedCategories.some(sel => sel.code === cat.id)
            ));

        return matchesSearch && matchesCategory;
    });

    const handleOpenApply = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.dashboardWrapper}>
            <Header userName={userName} />
            <div className={styles.layoutBody}>
                <SideBar />
                <main className={styles.contentCard}>
                    <section className={styles.sectionHeader}>
                        <h2>Pieejāmie darbi</h2>

                        <div>
                            <div className={styles.searchWrapper}>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="meklēt..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className={styles.searchBtn}>
                                    <img src={searchIcon} alt="Search" className={styles.searchIconImg} />
                                </button>
                            </div>

                            <MultiSelect
                                value={selectedCategories}
                                onChange={(e) => setSelectedCategories(e.value)}
                                options={categories}
                                optionLabel="name"
                                placeholder="Filtrēt pēc kategorijas"
                                maxSelectedLabels={3}
                                className="w-full md:w-20rem "
                                style={{ border: '1px solid #ccc', borderRadius: '2rem', boxShadow: 'none', outline: 'none' }}
                            />
                        </div>


                    </section>

                    <div className={styles.mainContent}>

                        <div className={styles.jobsFeed}>
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <JobCard
                                        key={job.listing_id}
                                        job={job}
                                        onApply={() => handleOpenApply(job)}
                                    />
                                ))
                            ) : (
                               <p>nekas nebija atrasts</p>
                            )}
                        </div>

                        <Dialog
                            header={`Pieteikties: ${selectedJob?.name}`}
                            visible={isModalOpen}
                            onHide={() => setIsModalOpen(false)}
                            style={{ width: '450px' }}
                            className={styles.popup}
                            pt={{
                                header: { className: styles.popupHeader },
                                content: { className: styles.popupContent },
                                root: { className: styles.popupRoot }
                            }}
                        >
                            {selectedJob && (
                                <div className={styles.popupContent}>
                                    <p className={styles.jobDesc}>
                                        {selectedJob.description}
                                    </p>

                                    <div className={styles.jobDetails}>
                                        <div className={styles.jobDetail}> <span className={styles.detailTag}>budžets</span>{selectedJob.budget} EUR</div>

                                        <div className={styles.jobDetail}> <span className={styles.detailTag}>termiņš</span>{selectedJob.deadline_days} dienas</div>

                                        <div className={styles.jobDetail}> <span className={styles.detailTag}>publicēja</span>{selectedJob.username}</div>
                                    </div>



                                    <div className={styles.tagRow}>

                                        {selectedJob.categories && selectedJob.categories.length > 0 ? (
                                            selectedJob.categories.map((cat) => (
                                                <span key={cat.id} className={styles.tag} >
                                                    {cat.name}
                                                </span> ))
                                        ) : (
                                            <span className={styles.tag}>Nav kategoriju</span>
                                        )}

                                    </div>


                                    <button className={styles.btnBlackPopup} style={{width: '100%', marginTop: '10px'}}>Pieteikties</button>

                                </div>


                            )}
                        </Dialog>
                    </div>

                </main>
            </div>
        </div>

    );
};

export default JobsPage;
