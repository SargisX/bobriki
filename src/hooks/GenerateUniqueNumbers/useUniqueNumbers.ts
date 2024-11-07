import { useState } from "react"

export function useUniqueTicketNum() {
    const [generatedTicketNums, setGeneratedTicketNums] = useState<Set<number>>(new Set())

    const generateUniqueTicketNum = (): number => {
        const min = 1000000000
        const max = 9999999999
        let ticketNum: number

        do {
            ticketNum = Math.floor(Math.random() * (max - min + 1)) + min
        } while (generatedTicketNums.has(ticketNum))

        setGeneratedTicketNums(prev => new Set(prev.add(ticketNum)))

        return ticketNum
    }

    return { generateUniqueTicketNum }
}
