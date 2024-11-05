// busTickets.api.ts
import axios from "axios";
import { AddTicket, Ticket } from "./types";

const URL = 'https://tidylunch-eu.backendless.app/api/data/tickets'; // Make sure to set your URL here

export const getTickets = async (): Promise<Ticket[]> => {
    const response = await axios.get(URL);
    return response.data;
};

export const addTicket = async (ticket: AddTicket): Promise<Ticket> => {
    const response = await axios.post(URL, ticket);
    return response.data
};

export const deleteTicket = async (id: string): Promise<Ticket> => {
    try {
        const response = await axios.delete(`${URL}/${id}`);
        return response.data; // Return the response data (the deleted ticket or a confirmation message)
    } catch (error) {
        console.error("Error deleting ticket:", error);
        throw error; // Rethrow the error to be handled in the calling function
    }
};