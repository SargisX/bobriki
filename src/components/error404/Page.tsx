import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.css'; // CSS modules for styling

export const Error404 = () => {
    return (
        <div className={styles.errorPage}>
            <div className={styles.errorContainer}>
                <div className={styles.icon}>🛠️</div>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.errorMessage}>Page Not Found</h2>
                <p className={styles.errorDescription}>
                    The page you are looking for might have been moved or deleted.
                </p>
                <Link to="/" className={styles.backLink}>
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
};
