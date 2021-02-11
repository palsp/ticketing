import mongoose from 'mongoose'
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'


it('fetches the order', async () => {
    //Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })

    await ticket.save()
    // make a request to build an order with this ticket 

    const user = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // make a req to fetch order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id)
})



it('return an error if one user tries to fetch another users order', async () => {
    //Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })

    await ticket.save()
    // make a request to build an order with this ticket 

    const user = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    // make a req to fetch order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signup())
        .send()
        .expect(401);

})