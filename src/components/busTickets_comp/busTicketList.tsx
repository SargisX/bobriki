import React, { useEffect, useState } from 'react';
import { Ticket } from '../busTickets_comp/types';
import { getTickets, updateTicket } from '../busTickets_comp/busTickets.api';
import { QRGenerator } from '../qr/qrGenerator';
import styles from './TicketList.module.css';
import { getCurrentSession } from '../users_comp/auth/authUtils';

export const TicketList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [usedTickets, setUsedTickets] = useState<Ticket[]>([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showUsedArchive, setShowUsedArchive] = useState(false);


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const fetchedTickets = await getTickets();
                const currentSession = getCurrentSession();
                const userId = currentSession ? currentSession.userId : null;
                const userTickets = fetchedTickets.filter(ticket => ticket.userId === userId);
                const activeTickets = userTickets.filter(ticket => !ticket.isUsed);
                const archivedTickets = userTickets.filter(ticket => ticket.isUsed);

                setTickets(activeTickets);
                setUsedTickets(archivedTickets);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            }
        };

        fetchTickets();
    }, []);


    const handleQRClick = (ticket: Ticket) => {
        const qrContainer = document.getElementById(`qr-${ticket.objectId}`);
        if (qrContainer) {
            qrContainer.requestFullscreen()
                .then(() => setIsFullScreen(true))
                .catch(err => console.error("Failed to enter fullscreen:", err));
        }
    };

    // Handle ticket deletion
    // const handleDelete = async (ticketId: string) => {
    //     const isConfirmed = window.confirm("Are you sure you want to delete this ticket?");
    //     if (!isConfirmed) return;

    //     try {
    //         await deleteTicket(ticketId);
    //         setTickets(prevTickets => prevTickets.filter(ticket => ticket.objectId !== ticketId));
    //     } catch (error) {
    //         console.error("Failed to delete ticket:", error);
    //     }
    // };


    const handleMarkAsUsed = async (ticketId: string) => {
        const isConfirmed = window.confirm("Mark this ticket as used?");
        if (!isConfirmed) return;


        setTickets(prevTickets => {
            const ticket = prevTickets.find(ticket => ticket.objectId === ticketId);
            if (ticket) {
                ticket.isUsed = true;

                setUsedTickets(prevUsed => [...prevUsed, ticket]);
            }

            return prevTickets.filter(ticket => ticket.objectId !== ticketId);
        });


        try {
            const updatedTicket = { isUsed: true };
            await updateTicket(ticketId, updatedTicket);
        } catch (error) {
            console.error("Failed to mark ticket as used:", error);
        }
    };



    useEffect(() => {
        const exitFullscreenHandler = () => {
            if (document.fullscreenElement === null) {
                setIsFullScreen(false);
            }
        };

        document.addEventListener('fullscreenchange', exitFullscreenHandler);
        return () => document.removeEventListener('fullscreenchange', exitFullscreenHandler);
    }, []);


    const handleLongPress = (ticketId: string) => {
        let pressTimer: NodeJS.Timeout;
        const start = () => {
            pressTimer = setTimeout(() => handleMarkAsUsed(ticketId), 600);
        };
        const cancel = () => clearTimeout(pressTimer);

        return { onMouseDown: start, onTouchStart: start, onMouseUp: cancel, onMouseLeave: cancel, onTouchEnd: cancel };
    };

    return (
        <div>
            <button className={styles.usedBtn} onClick={() => setShowUsedArchive(prev => !prev)}>
                {showUsedArchive ? "Active Tickets" : "Used Tickets"}
            </button>
            {showUsedArchive ? (
                <>
                    <div className={styles.listHeader}><h2>Used Tickets</h2></div>
                    {usedTickets.length > 0 ? (
                        <ul style={{ listStyleType: 'none' }} className={styles.qrList}>
                            {usedTickets.map((ticket, index) => (
                                <li key={ticket.objectId} style={{ marginBottom: '10px', position: 'relative' }} className={styles.qrBox}>
                                    <h3>QR: {index + 1} (Used)</h3>
                                    <QRGenerator value={ticket.value} isFullScreen={isFullScreen} />
                                    <div className={styles.qrNumber}>
                                        <p>Qr Code </p>
                                        <p><strong>{ticket.ticketNum}</strong></p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noTickets}>No used tickets found.</p>
                    )}
                </>
            ) : (
                <>
                    <div className={styles.listHeader}><h2>Active Tickets</h2></div>
                    {tickets.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }} className={styles.qrList}>
                            {tickets.map((ticket, index) => (
                                <li key={ticket.objectId} style={{ marginBottom: '10px', position: 'relative' }} className={styles.qrBox}>
                                    <h2>QR: {index + 1}</h2>
                                    <div
                                        id={`qr-${ticket.objectId}`}
                                        className={isFullScreen ? styles.fullScreenQRContainer : ''}
                                        onClick={() => handleQRClick(ticket)}
                                        style={{ cursor: 'pointer' }}
                                        {...handleLongPress(ticket.objectId)}
                                    >
                                        <QRGenerator value={ticket.value} isFullScreen={isFullScreen} />
                                    </div>
                                    <div className={styles.qrNumber}>
                                        <p>Qr Code </p>
                                        <p><strong>{ticket.ticketNum}</strong></p>
                                    </div>
                                    {/* <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(ticket.objectId)}
                                    >
                                        Delete
                                    </button> */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noTickets}>No active tickets found.</p>
                    )}
                </>
            )}
        </div>
    );
};
