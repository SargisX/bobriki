import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/" className={styles.logoText}>MyApp</Link>
            </div>
            <ul className={styles.navLinks}>
                <li><Link to="/" className={styles.link}>Home</Link></li>
                <li><Link to="/schedule" className={styles.link}>Schedule</Link></li>
                <li><Link to="/error" className={styles.link}>Error</Link></li>
            </ul>
        </nav>
    );
}
