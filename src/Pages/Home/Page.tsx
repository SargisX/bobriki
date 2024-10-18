import React, { useEffect, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import styles from './home.module.css'
import { FaCalendar, FaPhone, FaUser, FaCog } from 'react-icons/fa'

interface Props {
  isLoggedIn: boolean;
}

export const Home: React.FC<Props> = ({ isLoggedIn }) => {

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      threshold: 0.1,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible)
          observer.unobserve(entry.target)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)


    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => {

      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card)
      })
    }
  }, [])

  return (
    isLoggedIn ? <>
      <div className={styles.container}>
        <h1 className={styles.heading}>Welcome to Our Website</h1>
        <p className={styles.description}>Explore the features of our site using the links below:</p>

        <div className={styles.cardContainer}>
          <Link to="/schedule">
            <div ref={el => (cardRefs.current[0] = el)} className={`${styles.card} ${styles.hidden}`}>
              <FaCalendar className={styles.icon} />
              <h3 className={styles.cardText}>Schedule</h3>
            </div>
          </Link>
          <Link to="/about">
            <div ref={el => (cardRefs.current[1] = el)} className={`${styles.card} ${styles.hidden}`}>
              <FaUser className={styles.icon} />
              <h3 className={styles.cardText}>About Us</h3>
            </div>
          </Link>
          <Link to="/services">
            <div ref={el => (cardRefs.current[2] = el)} className={`${styles.card} ${styles.hidden}`}>
              <FaCog className={styles.icon} />
              <h3 className={styles.cardText}>Our Services</h3>
            </div>
          </Link>
          <Link to="/contact">
            <div ref={el => (cardRefs.current[3] = el)} className={`${styles.card} ${styles.hidden}`}>
              <FaPhone className={styles.icon} />
              <h3 className={styles.cardText}>Contact Us</h3>
            </div>
          </Link>

        </div>
      </div>
    </>
      :
      <Navigate to={'/signin'} />
  )
}
