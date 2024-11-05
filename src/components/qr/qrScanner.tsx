// QRScanner.tsx
import React, { useEffect, useState } from "react";
import jsQR from 'jsqr';
import { WebcamCapture } from "./webcam";
import styles from './qrScanner.module.css';
import { QRGenerator } from "./qrGenerator";
import { AddTicket, Ticket } from "../busTickets_comp/types";
import { addTicket, getTickets } from "../busTickets_comp/busTickets.api";
import axios from "axios";
import { getCurrentSession } from "../users_comp/auth/authUtils";

interface QRScannerProps {
    onSaveSuccess: () => void; // Prop to receive the toggle function
}

export const QRScanner: React.FC<QRScannerProps> = ({ onSaveSuccess }) => {
    const [qrCode, setQrCode] = useState<string>("");
    const [isScanning, setIsScanning] = useState<boolean>(true);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [userId, setUserId] = useState<string>("");

    const handleScan = (imageSrc: string | null) => {
        if (imageSrc) {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
                    if (code) {
                        setQrCode(code.data);
                        console.log("code: ", code.data);
                        setIsScanning(false);
                    }
                }
            };
        }
    };

    const handleScanNew = () => {
        setQrCode("");
        setIsScanning(true);
    };

    const handleSave = async () => {
        if (qrCode) {
            try {
                const existingTickets = await getTickets();
                // Filter tickets by userId and QR code value
                const existingTicket = existingTickets.find(ticket => ticket.value === qrCode && ticket.userId === userId);
                
                if (!existingTicket) {
                    const newTicket: AddTicket = {
                        value: qrCode.trim(),
                        userId
                    };

                    console.log("Saving ticket with value:", newTicket.value);
                    const savedTicket = await addTicket(newTicket);
                    console.log("Ticket saved successfully:", savedTicket);
                    alert("Ticket saved successfully!");

                    // Call the onSaveSuccess prop to close the scanner
                    onSaveSuccess();

                    setTickets(prevTickets => [...prevTickets, savedTicket]);
                } else {
                    alert("Ticket with this value already exists for this user.");
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error("Failed to save ticket:", error.response.data);
                } else {
                    console.error("Failed to save ticket:", error);
                }
                alert("Failed to save ticket.");
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleScan(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        getTickets()
            .then(res => {
                setTickets(res);
            })
            .catch(error => {
                console.error("Failed to fetch tickets:", error);
            });
        const session = getCurrentSession();
        if (session) {
            setUserId(session.userId);
        }
    }, []);

    return (
        <div className={styles.qrScannerContainer}>
            {isScanning ? (
                <>
                    <WebcamCapture onScan={handleScan} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className={styles.fileInput}
                    />
                </>
            ) : (
                <div className={styles.btns}>
                    <QRGenerator value={qrCode} />
                    <button onClick={handleSave} className={styles.saveButton}>
                        Save QR Code
                    </button>
                    <button onClick={handleScanNew} className={styles.scanNewButton}>
                        Scan New QR Code
                    </button>
                </div>
            )}
        </div>
    );
};
