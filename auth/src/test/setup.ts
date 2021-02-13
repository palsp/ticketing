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
beforeAll(async (done) => {

    process.env.JWT_KEY = 'asdfasdfaf';
    mongo = new MongoMemoryServer();

    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    done();


});


beforeEach(async (done) => {

    jest.setTimeout(30000);
    const collections = await mongoose.connection.db.collections();
    // clear db
    for (let collection of collections) {
        await collection.deleteMany({})
    }
    done();

});

afterAll(async (done) => {

    await mongo.stop();
    await mongoose.connection.close();
    done();

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