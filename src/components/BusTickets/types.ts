export interface Ticket{
    id:string
    value:string
    userId:string
}

export type AddTicket = Omit<Ticket,'id'>