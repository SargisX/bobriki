import { useEffect, useState, TouchEvent } from "react"
import { Link, useParams } from "react-router-dom"
import { Website } from "./types"
import { getSiteById } from "./freeSite.api"
import styles from "./freeSitePage.module.css"

export const FreeSitePage = () => {
    const { siteid } = useParams<{ siteid: string }>()
    const [site, setSite] = useState<Website | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [initialDistance, setInitialDistance] = useState<number | null>(null)
    const [initialTouchPos, setInitialTouchPos] = useState<{ x: number, y: number } | null>(null)
    const downloadPhoto = `https://raw.githubusercontent.com/SargisX/bobriki/main/public/files/websites/${Number(siteid) - 100}.zip`

    useEffect(() => {
        if (siteid) {
            getSiteById(siteid).then((res) => setSite(res))
        }
    }, [siteid])


    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.touchAction = 'none'
        } else {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }
    }, [isModalOpen])

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
        setScale(1)
        setPosition({ x: 0, y: 0 })
        setInitialDistance(null)
        setInitialTouchPos(null)
    }

    const handleTouchStart = (e: TouchEvent<HTMLImageElement>) => {
        e.preventDefault()
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[1].clientX - e.touches[0].clientX,
                e.touches[1].clientY - e.touches[0].clientY
            )
            setInitialDistance(distance)
        } else if (e.touches.length === 1) {

            const touch = e.touches[0]
            setInitialTouchPos({ x: touch.clientX - position.x, y: touch.clientY - position.y })
        }
    }

    const handleTouchMove = (e: TouchEvent<HTMLImageElement>) => {
        e.preventDefault()
        if (e.touches.length === 2 && initialDistance) {
            const distance = Math.hypot(
                e.touches[1].clientX - e.touches[0].clientX,
                e.touches[1].clientY - e.touches[0].clientY
            )
            const newScale = distance / initialDistance
            setScale(newScale)
        } else if (e.touches.length === 1 && initialTouchPos) {
            const touch = e.touches[0]

            const newX = touch.clientX - initialTouchPos.x
            const newY = touch.clientY - initialTouchPos.y
            setPosition({ x: newX, y: newY })
        }
    }

    if (!site) {
        return <p className={styles.loading}>Loading site details...</p>
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.content}>
                <div className={styles.imageSection}>
                    <img
                        src={site.image}
                        alt={site.name}
                        className={styles.siteImage}
                        onClick={toggleModal}
                    />
                </div>

                <div className={styles.siteInfo}>
                    <h1 className={styles.siteName}>{site.name}</h1>
                    <p className={styles.description}>{site.description}</p>

                    <div className={styles.details}>
                        <p className={styles.detailItem}>
                            Author: <strong>{site.author}</strong>
                        </p>
                        <p className={styles.detailItem}>
                            Technologies: {site.technologies.join(", ")}
                        </p>
                        <p className={styles.detailItem}>
                            Platform: {site.platform.join(", ")}
                        </p>
                        <p className={styles.detailItem}>
                            Category: {site.category}
                        </p>
                        <p className={styles.detailItem}>
                            Status: <strong>{site.status}</strong>
                        </p>
                        <p className={styles.detailItem}>
                            Date Added: {new Date(site.dateAdded).toLocaleDateString()}
                        </p>
                    </div>

                    <div className={styles.tags}>
                        {site.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    <a href={downloadPhoto} download={`${Number(siteid) - 100}.zip`}><button className={styles.button}>Download now</button></a>
                    <Link to='/free-sites'><button className={styles.back_btn}>Back</button></Link>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modal} onClick={toggleModal}>
                    <img
                        src={site.image}
                        alt={site.name}
                        className={styles.modalImage}
                        style={{
                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                    />
                </div>
            )}
        </div>
    )
}
