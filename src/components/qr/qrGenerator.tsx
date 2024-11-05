import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG
import styles from './qrGenerator.module.css'; // Add your styles here

interface QRGeneratorProps {
    value: string; // Define the value prop
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ value }) => { // Destructure the value prop

    return (
        <div className={styles.qrGeneratorContainer}>
            <h2>QR Code Generator</h2>
            {value && ( // Only render if value is provided
                <div className={styles.qrCodeContainer}>
                    <QRCodeSVG value={value} size={256} /> {/* Generate QR code */}
                </div>
            )}
        </div>
    );
};

export default QRGenerator;
