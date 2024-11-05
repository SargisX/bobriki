import axios from "axios"
import { Ticket, AddTicket } from "./types"

const URL = 'https://bobriki.free.beeceptor.com'

export const getTickets = async (): Promise<Ticket[]> => {
    const response = await axios.get(URL)
    return response.data
}

export const addTicket = async (ticket: AddTicket): Promise<Ticket> => {
    const response = await axios.post(URL, ticket)
    return response.data
}
