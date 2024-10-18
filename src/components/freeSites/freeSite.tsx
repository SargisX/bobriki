import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Website, Status } from "./types"
import { getAllSites } from "./freeSite.api"
import styles from "./freeSites.module.css"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"

export const FreeSite = () => {
    const [sites, setSites] = useState<Website[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const loadingGif = "https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/loader.gif"

    useEffect(() => {
        const fetchSites = async () => {
            setLoading(true)
            try {
                const res = await getAllSites()
                setSites(res)
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

    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.heading}>Free Sites</h2>

            {loading ? (
                <div className={styles.loader}>
                    <img src={loadingGif} alt="Loading..." className={styles.loadingImage} />
                </div>
            ) : (
                <div className={styles.container}>
                    {sites.map((site) => (
                        <div
                            key={site.id}
                            className={styles.card}
                            onClick={() => handleClick(site.id)}
                        >
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
                    ))}
                </div>
            )}
        </div>
    )
}
