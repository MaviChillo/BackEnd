export default class TicketDTO {
    static getTicketFrom = (ticket) =>{
        const ticketDto = {
            code: ticket.code,
            purchase_datetime: ticket.purchase_datetime,
            amount: ticket.amount
        }
        return ticketDto
    }
}