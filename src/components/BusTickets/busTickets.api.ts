// busTickets.api.ts
import axios from "axios";
 interface Ticket{
    id:string
    value:string
    userId:string
}

 type AddTicket = Omit<Ticket,'id'>

const URL = 'https://your-api-url.com'; // Make sure to set your URL here

export const getTickets = async (): Promise<Ticket[]> => {
    const response = await axios.get(URL);
    return response.data;
};

export const addTicket = async (ticket: AddTicket): Promise<Ticket> => {
    const response = await axios.post(URL, ticket);
    return response.data;
};
