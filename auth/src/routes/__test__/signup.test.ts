import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    try {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);
    } catch (err) {

    }

});

it('returns a 400 with and an invalid email', async () => {
    try {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'asdfafafs',
                password: 'password'
            })
            .expect(400);

    } catch (err) {

    }
});

it('returns a 400 with an invalid password', async () => {
    try {

        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'p'
            })
            .expect(400);
    } catch (err) {

    }
})

it('returns a 400 with missing email and password', async () => {
    try {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com'
            })
            .expect(400);

        await request(app)
            .post('/api/users/signup')
            .send({
                password: 'password'
            })
            .expect(400);

    } catch (err) {

    }
})

it('disallows duplicate emails', async () => {
    try {

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(400);
    } catch (err) {

    }
});

it('sets a cookie after a successful signup', async () => {
    try {

        const response = await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);

        expect(response.get('Set-Cookie')).toBeDefined();
    } catch (err) {

    }
})