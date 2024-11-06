import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG
import styles from './qrGenerator.module.css'; // Add your styles here

interface QRGeneratorProps {
    value: string;
    isFullScreen?: boolean // Define the value prop
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ value, isFullScreen }) => { // Destructure the value prop
    const size = isFullScreen ? 350 : 256;
    return (
        <div className={styles.qrGeneratorContainer}>
            {value && ( // Only render if value is provided
                <div className={styles.qrCodeContainer}>
                    <QRCodeSVG value={value} size={size} /> {/* Generate QR code */}
                </div>
            )}
        </div>
    );
};

