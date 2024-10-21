import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Website, Status } from "./types"
import { getAllSites } from "./freeSite.api"
import styles from "./freeSite.module.css"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"

export const FreeSite = () => {
    const [sites, setSites] = useState<Website[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [filters, setFilters] = useState({
        category: "All",
        author: "",
        rating: "",
        downloadsCount: "",
        dateAdded: "",
        status: "",
        technology: "",
        popularity: "",
    })
    const [sortOption, setSortOption] = useState<string>("")
    const [filteredSites, setFilteredSites] = useState<Website[]>([])
    const navigate = useNavigate()
    const loadingGif = "https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/loader.gif"

    useEffect(() => {
        const fetchSites = async () => {
            setLoading(true)
            try {
                const res = await getAllSites()
                setSites(res)
                setFilteredSites(res)
            } catch (error) {
                console.error("Error fetching sites:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSites()
    }, [])

    const handleClick = (id: string) => {
        navigate(`/free-sites/${id}`)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value)
    }

    const toggleFilterVisibility = () => {
        setIsFilterVisible((prev) => !prev);
    };
    

    useEffect(() => {
        const applyFilters = () => {
            let currentFilteredSites = sites.filter((site) => {
                const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    site.author.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = filters.category === "All" || site.category === filters.category;
                const matchesAuthor = filters.author ? site.author.toLowerCase() === filters.author.toLowerCase() : true;
                const matchesRating = filters.rating ? site.rate === parseInt(filters.rating) : true;
                const matchesDownloads = filters.downloadsCount ? site.download >= parseInt(filters.downloadsCount) : true;
    
                // Date matching logic
                const dateAdded = new Date(site.dateAdded);
                const now = new Date();
                const isThisMonth = dateAdded.getFullYear() === now.getFullYear() && dateAdded.getMonth() === now.getMonth();
                const isThisWeek = Math.floor((now.getTime() - dateAdded.getTime()) / (1000 * 60 * 60 * 24)) < 7;
    
                const matchesDateAdded = (filters.dateAdded === "thisMonth" && isThisMonth) ||
                    (filters.dateAdded === "thisWeek" && isThisWeek) ||
                    (filters.dateAdded === "");
    
                return matchesSearch && matchesCategory && matchesAuthor && matchesRating && matchesDownloads && matchesDateAdded;
            });


            currentFilteredSites.sort((a: Website, b: Website) => {
                const dateA = new Date(a.dateAdded);
                const dateB = new Date(b.dateAdded);
    
                if (sortOption === "newest") {
                    return dateB.getTime() - dateA.getTime();
                } else if (sortOption === "oldest") {
                    return dateA.getTime() - dateB.getTime();
                } else if (sortOption === "mostPopular") {
                    return b.download - a.download; // Ensure 'download' exists
                }
                return 0;
            });

            setFilteredSites(currentFilteredSites);
        };
    
        applyFilters();
    }, [searchQuery, filters, sortOption, sites]);

    const resetFilters = () => {
        setFilters({
            category: "All",
            author: "",
            rating: "",
            downloadsCount: "",
            dateAdded: "",
            status: "",
            technology: "",
            popularity: "",
        })
        setSortOption("")
        setIsFilterVisible(false)
        setFilteredSites(sites)
    }


    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.heading}>Free Sites</h2>

            <div className={styles.searchContainer}>
                <button
                    className={styles.filterButton}
                    onClick={toggleFilterVisibility}
                    aria-expanded={isFilterVisible}
                >
                    Filter
                </button>

                <input
                    type="text"
                    placeholder="Search sites..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />



                <div className={styles.filterSidebar} style={{ left: isFilterVisible ? 0 : -400 }}>

                    <select name="category" value={filters.category} onChange={handleFilterChange}>
                        <option value="All">All</option>
                        <option value="Website templates">Website templates</option>
                    </select>

                    <input
                        type="text"
                        name="author"
                        placeholder="Author Name"
                        value={filters.author}
                        onChange={handleFilterChange}
                    />

                    <select name="rating" value={filters.rating} onChange={handleFilterChange}>
                        <option value="" disabled>Select Rating</option>
                        <option value="1">1 ⭐</option>
                        <option value="2">2 ⭐</option>
                        <option value="3">3 ⭐</option>
                        <option value="4">4 ⭐</option>
                        <option value="5">5 ⭐</option>
                    </select>

                    <input
                        type="number"
                        name="downloadsCount"
                        placeholder="Min Downloads Count"
                        value={filters.downloadsCount}
                        min={0}
                        step={1}
                        onChange={handleFilterChange}
                    />



                    <select name="dateAdded" value={filters.dateAdded} onChange={handleFilterChange}>
                        <option value="" disabled>Select Date Added</option>
                        <option value="thisMonth">This Month</option>
                        <option value="thisWeek">This Week</option>
                    </select>


                    <select name="sortOption" value={sortOption} onChange={handleSortChange}>
                        <option value="" disabled>Sort By</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="mostPopular">Most Popular</option>
                    </select>

                    <button onClick={resetFilters} className={styles.resetFilter}>Reset Filters</button>
                    <button onClick={()=>setIsFilterVisible(false)} className={styles.closeFilter}>Close</button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loader}>
                    <img src={loadingGif} alt="Loading..." className={styles.loadingImage} />
                </div>
            ) : (
                <div className={styles.container}>
                    {filteredSites.length > 0 ? (
                        filteredSites.map((site) => (
                            <div key={site.id} className={styles.card} onClick={() => handleClick(site.id)}>
                                <h3>{site.name}</h3>
                                <img
                                    src={site.image}
                                    alt={site.name}
                                    onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                                />
                                <p className={styles.status}>
                                    {site.status === Status.Active ? (
                                        <FaCheckCircle className={styles.iconActive} />
                                    ) : (
                                        <FaTimesCircle className={styles.iconInactive} />
                                    )}
                                    <strong>{site.status}</strong>
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            )}
        </div>
    )
}
