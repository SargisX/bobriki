import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Website } from "./types"
import { getAllSites } from "./freeSite.api"
import styles from "./freeSites.module.css"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { Status } from "./types"; // Adjust the path as necessary


export const FreeSite = () => {
    const [sites, setSites] = useState<Website[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        getAllSites()
            .then(res => {
                setSites(res)
            })
    }, [])

    const handleClick = (id: string) => {
        navigate(`/free-sites/${id}`)
    }

    return (
        <div className={styles.pageContainer}>
            <h2 className={styles.heading}>FreeSite</h2>
            <div className={styles.container}>
                {
                    sites.map((site) => (
                        <div key={site.id} className={styles.card} onClick={() => handleClick(site.id)}>
                            <h3>{site.name}</h3>
                            <img src={site.image} alt={site.name} />
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
                }
            </div>
        </div>
    )
}
