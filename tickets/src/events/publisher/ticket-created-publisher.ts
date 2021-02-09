import { Publisher, Subjects, TicketCreatedEvent } from '@palspticket/common'


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}