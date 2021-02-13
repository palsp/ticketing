import request from 'supertest';
import { app } from '../../app';

it('clears the cookie aftere signing out', async () => {
    try {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })

        const response = await request(app)
            .post('/api/users/signout')
            .send({})
            .expect({})
            .expect(200)

        expect(response.get('Set-Cookie')[0]).toEqual(
            'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
        )
    } catch (err) {

    }


})