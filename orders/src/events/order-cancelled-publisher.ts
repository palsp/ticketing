import { Subjects, Publisher, OrderCancelledEvent } from '@palspticket/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}