import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper'

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'asdfasdf',
            price: 20
        })
        .expect(404);

})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'asdfasdf',
            price: 20
        })
        .expect(401);
})

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'asdfasdfa',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signup())
        .send({
            title: 'dddddddd',
            price: 21
        })
        .expect(401)

})

it('returns a 400 if the user is provides an invalid title or price', async () => {
    const cookie = global.signup()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdfasdfa',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'asdfasdf',
            price: -20
        })
        .expect(400)

})

it('returns update the ticket provided valid input', async () => {
    const cookie = global.signup()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdfasdfa',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    const ticket = await Ticket.findById(response.body.id);

    expect(ticket?.title).toEqual('new title')
    expect(ticket?.price).toEqual(100)


})


it('publishes an event', async () => {
    const cookie = global.signup()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdfasdfa',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})