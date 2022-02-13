import { model, Mongoose } from 'mongoose';
import { EmailModel, EmailSchema } from '../../../src/auth/data/models/email.model';
import { UserModel, UserSchema } from '../../../src/auth/data/models/user.model';

export const prepareEmailDb = async (client: Mongoose) => {
    const model = client.model<EmailModel>('Email', EmailSchema);
    await model.ensureIndexes();

    return await model.insertMany(emails);
};

export const cleanUpEmailDb = async (client: Mongoose) => {
    await client.connection.dropCollection('emails');
};

export const prepareUserDb = async (client: Mongoose) => {
    const model = client.model<UserModel>('User', UserSchema);
    await model.ensureIndexes();

    return await model.insertMany(users);
};

export const cleanUpUserDb = async (client: Mongoose) => {
    await client.connection.dropCollection('users');
};

const emails = [
    {
        email: 'test@mail.com',
        role: 'test'
    },
    {
        email: 'admin@mail.com',
        role: 'admin'
    },
    {
        email: 'user@mail.com',
        role: 'user'
    }
];

const users = [
    {
        username: 'Admin',
        email: 'admin@mail.com',
        password: 'password',
        role: 'admin',
        isConfirmed: true
    },
    {
        username: 'User',
        email: 'user@mail.com',
        password: 'password',
        role: 'user',
        isConfirmed: false
    }
];
