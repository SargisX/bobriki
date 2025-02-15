import { Link, NavLink } from "react-router-dom"
import {  useState } from "react"
import styles from "./Navbar.module.css"
import { clearSession } from "../users_comp/auth/authUtils"
import { User } from "../users_comp/types"

interface NavbarProps {
  isLoggedIn: boolean
  role: string | null
  setIsLoggedIn: (value: boolean) => void
  setRole: (role: string | null) => void
  user:User|null
}

export default function Navbar({ isLoggedIn, role, setIsLoggedIn, setRole,user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)


  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    clearSession()
    setIsLoggedIn(false)
    setRole(null)
    localStorage.clear()
    closeMenu()
  }


  return (
    <header>
      <nav className={styles.navbar}>
      {isLoggedIn &&<Link to="/profile"><img className={styles.profilePicture} src={user?.profilePicture} alt={user?.username+"'s picture"} /></Link>}
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
            <li>
              <NavLink to="/bobrnews" className={({ isActive }) => (isActive ? styles.active : undefined)} onClick={closeMenu}>Bobr News</NavLink>
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
              <Link to={"/signin"} onClick={handleLogout} className={styles.logoutButton}>Logout</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
