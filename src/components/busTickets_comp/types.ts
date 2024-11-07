export interface Ticket{
    objectId:string
    value:string
    userId:string
    isUsed:boolean
    ticketNum:number
}

export type AddTicket = Omit<Ticket,'objectId'>