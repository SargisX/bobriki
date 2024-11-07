// QRScanner.tsx
import React, { useEffect, useRef, useState } from "react"
import jsQR from 'jsqr'
import { WebcamCapture } from "./webcam"
import styles from './qrScanner.module.css'
import { QRGenerator } from "./qrGenerator"
import { AddTicket } from "../busTickets_comp/types"
import { addTicket, getTickets } from "../busTickets_comp/busTickets.api"
import axios from "axios"
import { getCurrentSession } from "../users_comp/auth/authUtils"
import { useUniqueTicketNum } from "../../hooks/GenerateUniqueNumbers/useUniqueNumbers"

interface QRScannerProps {
    onSaveSuccess: () => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ onSaveSuccess }) => {
    const [qrCode, setQrCode] = useState<string>("")
    const [isScanning, setIsScanning] = useState<boolean>(true)
    const [userId, setUserId] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // Use the custom hook
    const { generateUniqueTicketNum } = useUniqueTicketNum();

    const handleScan = (imageSrc: string | null) => {
        if (imageSrc) {
            const image = new Image()
            image.src = imageSrc
            image.onload = () => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    canvas.width = image.width
                    canvas.height = image.height
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" })
                    if (code) {
                        setQrCode(code.data)
                        setIsScanning(false)
                    }
                }
            }
        }
    }

    const handleScanNew = () => {
        setQrCode("")
        setIsScanning(true)
    }

    const handleSave = async () => {
        if (qrCode) {
            try {
                const existingTickets = await getTickets();
                const existingTicket = existingTickets.find(ticket => ticket.value === qrCode && ticket.userId === userId);

                if (!existingTicket) {
                    // Generate a unique ticket number using the hook
                    const ticketNum = generateUniqueTicketNum();

                    // Save a new ticket with the generated ticketNum
                    const newTicket: AddTicket = {
                        value: qrCode.trim(),
                        userId,
                        isUsed: false, // Initially set to not used
                        ticketNum // Add the generated ticketNum
                    };
                    await addTicket(newTicket);
                    alert("Ticket saved successfully!");
                    onSaveSuccess();
                } else if (existingTicket.isUsed) {
                    // If the ticket exists but is already used
                    alert("This ticket has already been used.");
                } else {
                    // If the ticket exists but has not been used yet
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
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                handleScan(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleFileButtonClick = () => {
        fileInputRef.current?.click()
    }

    useEffect(() => {
        getTickets()
            .catch(error => {
                console.error("Failed to fetch tickets:", error)
            })
        const session = getCurrentSession()
        if (session) {
            setUserId(session.userId)
        }
    }, [])

    return (
        <div className={styles.qrScannerContainer}>
            {isScanning ? (
                <>
                    <WebcamCapture onScan={handleScan} />
                    <button onClick={handleFileButtonClick} className={styles.fileButton}>
                        Upload QR Image
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        style={{ display: "none" }}
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
    )
}
