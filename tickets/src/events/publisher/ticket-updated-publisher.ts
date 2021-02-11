import { Publisher, Subjects, TicketUpdatedEvent } from '@palspticket/common'


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}