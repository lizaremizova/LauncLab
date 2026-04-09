import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JobsPage.module.css';
import JobCard from "@/components/JobCard/JobCard.jsx";
import SideBar from "@/components/SideBar/SideBar.jsx";
import Header from "@/components/Header/Header.jsx"
import searchIcon from "@/assets/search.svg";
import { MultiSelect } from 'primereact/multiselect';
const JobsPage = () => {

    const navigate = useNavigate();
    const userName = localStorage.getItem('USER_NAME') || "Viesis";
    const [feedJobs, setFeedJobs] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);

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
                    console.error('Expected array, got:', data);
                    setFeedJobs([]);
                }
            })
            .catch(err => console.error("Feed fetch failed:", err));
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

    return (
        <div className={styles.dashboardWrapper}>
            <Header userName={userName} />
            <div className={styles.layoutBody}>
                <SideBar />
                <main className={styles.contentCard}>
                    <section className={styles.sectionHeader}>
                        <h2>Pieejāmie darbi</h2>

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

                        <MultiSelect
                            value={selectedCategories}
                            onChange={(e) => setSelectedCategories(e.value)}
                            options={categories}
                            optionLabel="name"
                            placeholder="Filtrēt pēc kategorijas"
                            maxSelectedLabels={3}
                            className="w-full md:w-20rem"
                            style={{ border: '1px solid #ccc' }}
                        />

                    </section>

                    <div className={styles.mainContent}>

                        <div className={styles.jobsFeed}>
                            {Array.isArray(feedJobs) && feedJobs.map((job) => (
                                <JobCard
                                    key={job.listing_id}
                                    job={job}
                                    onApply={handleApply}
                                />
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>

    );
};

export default JobsPage;
