import { Link, NavLink } from "react-router-dom"
import styles from "./Navbar.module.css"
import { useState } from "react"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  // Toggle menu open/close
  const toggleMenu = () => setMenuOpen(prev => !prev)

  // Close menu on link click
  const closeMenu = () => setMenuOpen(false)

  return (
    <header>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          Bobrik
        </Link>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <span className={`${styles.menuBar} ${menuOpen ? styles.menuOpen : ""}`}></span>
          <span className={`${styles.menuBar} ${menuOpen ? styles.menuOpen : ""}`}></span>
          <span className={`${styles.menuBar} ${menuOpen ? styles.menuOpen : ""}`}></span>
        </div>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ""}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? styles.active : undefined}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/schedule"
              className={({ isActive }) => isActive ? styles.active : undefined}
              onClick={closeMenu}
            >
              Schedule
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) => isActive ? styles.active : undefined}
              onClick={closeMenu}
            >
              Services
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
