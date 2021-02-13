import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signup(id?: string): string[];
        }
    }
}


jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51IKI9ZER5rkNKNBMNik3y0ki7NYieyIw4piykQCcYX7UIiK6y2d5oiveR9zYjXY8SsvW6YhDivhSvFWicAl9dzF900w4LzG1MZ'

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdfaf';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
});


beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    // clear db
    for (let collection of collections) {
        await collection.deleteMany({})
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signup = (id?: string) => {
    // Build a JWT payload { id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    //Build session object { jwt :  MY_JWT}
    const session = { jwt: token }

    // Turn session into JSON 
    const sessionJSON = JSON.stringify(session);

    //Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return a string thats the cookie with the encode data
    return [`express:sess=${base64}`];
};