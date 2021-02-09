import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket'

it('has a route handler handling to /api/tickets for posts request', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})

    expect(response.status).not.toEqual(404);
});

it('can only be access if the user is sign in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is sign in', async () => {
    const cookie = global.signup();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({})


    expect(response.status).not.toEqual(401)
})


it('should return an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            price: 10
        })
        .expect(400);

});

it('should return an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'asdfasss',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title: 'asdfasdfafd',
        })
        .expect(400);
});

it('create a ticket with valid inputs', async () => {

    // add in a check to make sure a ticket was save
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = "adfasfafs"
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup())
        .send({
            title,
            price: 20
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title)

});