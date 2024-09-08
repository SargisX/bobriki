import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.css'; // Assuming you're using CSS modules for styling

export const Error404 = () => {
    return (
        <div className={styles.errorPage}>
            <div className={styles.errorContainer}>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.errorMessage}>Oops! Page Not Found</h2>
                <p className={styles.errorDescription}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className={styles.backLink}>
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};
