import { Subjects, Publisher, PaymentCreatedEvent } from '@palspticket/common'


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}