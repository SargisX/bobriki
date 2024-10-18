import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import styles from "./Navbar.module.css"
import { clearLoginSession } from "../auth/authUtils"

interface NavbarProps {
  isLoggedIn: boolean
  role: string | null
  setIsLoggedIn: (value: boolean) => void
  setRole: (role: string | null) => void
}

export default function Navbar({ isLoggedIn, role, setIsLoggedIn, setRole }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const navigate = useNavigate()

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    clearLoginSession()
    setIsLoggedIn(false)
    setRole(null)
    closeMenu()
    navigate("/signin")
  }

  return (
    <header>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>Bobrik</Link>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          <span className={`${styles.menuBar} ${menuOpen ? styles.menuOpen : ""}`}></span>
          <span className={`${styles.menuBar} ${menuOpen ? styles.menuOpen : ""}`}></span>
          <span className={`${styles.menuBar} ${menuOpen ? styles.menuOpen : ""}`}></span>
        </div>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ""}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : undefined)} onClick={closeMenu}>Home</NavLink>
          </li>
          {isLoggedIn && <>
            <li>
              <NavLink to="/services" className={({ isActive }) => (isActive ? styles.active : undefined)} onClick={closeMenu}>Services</NavLink>
            </li>
          </>
          }
          {isLoggedIn && role === "admin" && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? styles.active : undefined)} onClick={closeMenu}>Admin Panel</NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <NavLink to="/signup" className={({ isActive }) => (isActive ? styles.active : undefined)} onClick={closeMenu}>Sign Up</NavLink>
              </li>
              <li>
                <NavLink to="/signin" className={({ isActive }) => (isActive ? styles.active : undefined)} onClick={closeMenu}>Sign In</NavLink>
              </li>
            </>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
