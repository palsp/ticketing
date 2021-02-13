import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


declare global {
    namespace NodeJS {
        interface Global {
            signup(): Promise<string[]>
        }
    }
}

let mongo: any;
beforeAll(async () => {

    process.env.JWT_KEY = 'asdfasdfaf';
    mongo = new MongoMemoryServer();
    try {
        const mongoUri = await mongo.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        expect(err).toBe(err);
    }


});


beforeEach(async () => {
    try {
        const collections = await mongoose.connection.db.collections();
        // clear db
        for (let collection of collections) {
            await collection.deleteMany({})
        }
    } catch (err) {
        expect(err).toBe(err);
    }

});

afterAll(async () => {
    try {
        await mongo.stop();
        await mongoose.connection.close();
    } catch (err) {
        expect(err).toBe(err);
    }

});

global.signup = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201)

    const cookie = response.get('Set-Cookie');
    return cookie;
};