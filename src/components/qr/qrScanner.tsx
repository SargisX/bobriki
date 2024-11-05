import React, { useEffect, useState } from "react"; // Importing React and hooks
import jsQR from 'jsqr'; // Importing the jsQR library for QR code scanning
import { WebcamCapture } from "./webcam"; // Importing a component for capturing webcam feed
import styles from './qrScanner.module.css'; // Importing CSS styles specific to the QR scanner
// Importing API functions
import { getCurrentSession } from "../auth/authUtils"; // Importing function to get user session
import QRGenerator from "./qrGenerator"; // Importing QR code generator component

 interface Ticket{
    id:string
    value:string
    userId:string
}

 type AddTicket = Omit<Ticket,'id'>
export const QRScanner: React.FC = () => {
    const [qrCode, setQrCode] = useState<string>("");
    const [isScanning, setIsScanning] = useState<boolean>(true);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [userId, setUserId] = useState<string>("")

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
            }
        }
    }

    const handleScanNew = () => {
        setQrCode("");
        setIsScanning(true);
    }

    const handleSave = async () => {
        if (qrCode) {

            const existingTicket = tickets.find(ticket => ticket.value === qrCode);
            if (!existingTicket) {

                const newTicket: AddTicket = {
                    value: qrCode,
                    userId
                };

                // try {
                //     const savedTicket = await addTicket(newTicket);
                //     console.log("Ticket saved successfully:", savedTicket);
                //     alert("Ticket saved successfully!");
                //     setTickets([...tickets, savedTicket]);
                // } catch (error) {
                //     console.error("Failed to save ticket:", error);
                //     alert("Failed to save ticket.");
                // }
            } else {
                alert("Ticket with this value already exists.");
            }
        }
    }

    useEffect(() => {
        // getTickets()
        //     .then(res => {
        //         setTickets(res);
        //     })
        //     .catch(error => {
        //         console.error("Failed to fetch tickets:", error);
        //     })
        const session = getCurrentSession();
        if (session) {
            setUserId(session.userId);
        }
    }, []);

    return (
        <div className={styles.qrScannerContainer}>
            {isScanning ? (
                <WebcamCapture onScan={handleScan} />
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
}
