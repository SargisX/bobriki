import React, { useState } from 'react';
import styles from './admin.module.css'; // Ensure path is correct
import Terminal from '../../components/terminal/terminal'; // Ensure path is correct

export const Admin: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState<boolean>(false);

    const handleToggleTerminal = () => {
        setShowTerminal((prev) => !prev);
    };

    return (
        <div className={styles.bg}> {/* Full-screen gradient background */}
            <div className={styles.adminContainer}> {/* Grid layout */}
                <div className={styles.sidebar}>
                    <h3>Admin Panel</h3>
                    <button 
                        onClick={handleToggleTerminal} 
                        className={styles.toggleButton}
                    >
                        {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
                    </button>
                    
                </div>
                <div className={styles.content}>
                    {showTerminal && <Terminal />}
                </div>
            </div>
        </div>
    );
};
