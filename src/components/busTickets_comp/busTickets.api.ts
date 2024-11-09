import axios from "axios";
import { AddTicket, Ticket } from "./types";

// My server 
// const URL = 'https://bobriki-backend.onrender.com/api/tickets'; // Ensure this URL is correct
const URL = 'https://tidylunch-eu.backendless.app/api/data/tickets'; // Ensure this URL is correct

export const getTickets = async (): Promise<Ticket[]> => {
    const response = await axios.get(URL);
    return response.data;
};

export const addTicket = async (ticket: AddTicket): Promise<Ticket> => {
    try {
        const response = await axios.post(URL, ticket, {
            headers: {
                'Content-Type': 'application/json', // Ensure Content-Type is set to JSON
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding ticket:', error);
        throw error; // Rethrow the error so that the caller can handle it
    }
};

export const deleteTicket = async (id: string): Promise<Ticket> => {
    try {
        const response = await axios.delete(`${URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting ticket:", error);
        throw error;
    }
};

export const updateTicket = async (id: string, updatedTicket: Partial<Ticket>): Promise<Ticket> => {
    try {
        const response = await axios.put(`${URL}/${id}`, updatedTicket);
        return response.data;
    } catch (error) {
        console.error("Error updating ticket:", error);
        throw error;
    }
};
