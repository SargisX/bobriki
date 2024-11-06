// TicketList.tsx
import React, { useEffect, useState } from 'react';
import { Ticket } from '../busTickets_comp/types';
import { getTickets, deleteTicket } from '../busTickets_comp/busTickets.api'; // Ensure deleteTicket is imported
import { QRGenerator } from '../qr/qrGenerator';
import styles from './TicketList.module.css'; // Import the CSS Module
import { getCurrentSession } from '../users_comp/auth/authUtils';

export const TicketList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const fetchedTickets = await getTickets();
                const currentSession = getCurrentSession(); // Get current session data
                const userId = currentSession ? currentSession.userId : null; // Extract userId

                // Filter tickets based on userId
                const userTickets = fetchedTickets.filter(ticket => ticket.userId === userId);
                setTickets(userTickets);
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
                .then(() => {
                    setIsFullScreen(true);
                })
                .catch(err => {
                    console.error("Failed to enter fullscreen:", err);
                });
        }
    };

    const handleDelete = async (ticketId: string) => {
        // Confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete this ticket?");
        if (!isConfirmed) {
            return; // Exit the function if not confirmed
        }

        try {
            await deleteTicket(ticketId); // Call deleteTicket from API
            setTickets(prevTickets => prevTickets.filter(ticket => ticket.objectId !== ticketId)); // Update state to remove deleted ticket
        } catch (error) {
            console.error("Failed to delete ticket:", error);
        }
    };

    useEffect(() => {
        const exitFullscreenHandler = () => {
            if (document.fullscreenElement === null) {
                setIsFullScreen(false);
            }
        };

        document.addEventListener('fullscreenchange', exitFullscreenHandler);
        return () => {
            document.removeEventListener('fullscreenchange', exitFullscreenHandler);
        };
    }, []);

    return (
        <div>
            {tickets.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {tickets.map((ticket,index) => (
                        <li key={ticket.objectId} style={{ marginBottom: '10px', position: 'relative' }}>
                            <h2>QR: {index+1}</h2>
                            <div
                                id={`qr-${ticket.objectId}`}
                                className={isFullScreen ? styles.fullScreenQRContainer : ''}
                                onClick={() => handleQRClick(ticket)}
                                style={{ cursor: 'pointer' }} // Indicate clickable area
                            >
                                <QRGenerator value={ticket.value} isFullScreen={isFullScreen} />
                            </div>
                            <button 
                                className={styles.deleteButton} // Use the CSS Module class
                                onClick={() => handleDelete(ticket.objectId)} 
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tickets found.</p>
            )}
        </div>
    );
};
