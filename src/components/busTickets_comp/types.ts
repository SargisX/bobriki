export interface Ticket{
    objectId:string
    value:string
    userId:string
}

export type AddTicket = Omit<Ticket,'objectId'>