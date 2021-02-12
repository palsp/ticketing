import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@palspticket/common'
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming'

import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create a listener 
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket 
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })

    await ticket.save();

    // create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'asdfasdf'
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }


    // return all of the stuff

    return { listener, data, ticket, msg }
}


it('finds , updates, and saves a ticket', async () => {
    const { listener, data, ticket, msg } = await setup()

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.version).toEqual(data.version);
    expect(updatedTicket!.price).toEqual(data.price);
})


it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg);


    expect(msg.ack).toHaveBeenCalled();
})


it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener, ticket } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg)
    } catch (err) {

    }

    expect(msg.ack).not.toHaveBeenCalled();
})