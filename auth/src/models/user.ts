import mongoose from 'mongoose';

import { Password } from '../services/password'

// An interface that describe the properties
// that are required to create new user
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describe the properties
// that user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describe the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    // format that user going to be when sending along the network
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;

        },
        versionKey: false
    }
});

// user function keyword to refer this 
// to actual user we want to persit to db
userSchema.pre('save', async function (done) {

    // Hash password only when it is modified
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User };