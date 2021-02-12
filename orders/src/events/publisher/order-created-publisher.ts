import { Publisher, OrderCreatedEvent, Subjects } from '@palspticket/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}