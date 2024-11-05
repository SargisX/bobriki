import { useState } from 'react';
import {QRScanner} from '../qr/qrScanner';
import styles from './busTickets.module.css';

export const BusTickets: React.FC = () => {
    const [isScannerActive, setIsScannerActive] = useState<boolean>(false);

    const toggleScanner = () => {
        setIsScannerActive(prev => !prev);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Scanner</h2>
            <button className={styles.button} onClick={toggleScanner}>
                {isScannerActive ? 'Deactivate Scanner' : 'Activate Scanner'}
            </button>
            {isScannerActive && <div className={styles.qrScannerContainer}><QRScanner /></div>}
        </div>
    );
};
