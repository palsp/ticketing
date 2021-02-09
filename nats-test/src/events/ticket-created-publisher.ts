import { Publisher } from './based-publisher';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects'


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}