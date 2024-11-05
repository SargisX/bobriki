import { useState } from 'react';
import { QRScanner } from '../qr/qrScanner';
import styles from './busTickets.module.css';
import { TicketList } from './busTicketList';

export const BusTickets: React.FC = () => {
    const [isScannerActive, setIsScannerActive] = useState<boolean>(false);

    const toggleScannerOrList = () => {
        setIsScannerActive(prev => !prev);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={toggleScannerOrList}>
                    {isScannerActive ? 'Show QR List' : 'Show Scanner'}
                </button>
            </div>
            <div className={styles.contentContainer}>
                <div className={`${styles.scrollableContent} ${isScannerActive ? styles.hidden : ''}`}>
                {!isScannerActive && <TicketList />}
                </div>
                <div className={`${styles.scrollableContent} ${isScannerActive ? '' : styles.hidden}`}>
                    <div className={styles.qrScannerContainer}>
                        {isScannerActive && <QRScanner onSaveSuccess={toggleScannerOrList} />}
                    </div>
                </div>
            </div>
        </div>
    );
};
