import React, { useState } from 'react'
import styles from './admin.module.css' 
import Terminal from '../../components/terminal/terminal' 

export const Admin: React.FC = () => {
    const [showTerminal, setShowTerminal] = useState<boolean>(false)

    const handleToggleTerminal = () => {
        setShowTerminal((prev) => !prev)
    }

    return (
        <div className={styles.bg}> 
            <div className={styles.adminContainer}> 
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
    )
}
