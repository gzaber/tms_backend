import { expect } from 'chai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AuthRepository from '../../../../src/auth/data/repository/auth.repository';
import IAuthRepository from '../../../../src/auth/domain/repository/auth.repository.contract';
import config from '../../../../src/config/config';
import {
    cleanUpEmailDb,
    prepareEmailDb,
    cleanUpUserDb,
    prepareUserDb
} from '../../helpers/helpers';

dotenv.config();

describe('Auth Repository', () => {
    let client: mongoose.Mongoose;
    let sut: IAuthRepository;
    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        sut = new AuthRepository(client);
    });
    afterEach(() => {
        client.disconnect();
    });
    // =========================================================================
    describe('addEmail', function () {
        this.timeout(10000);
        beforeEach(async () => {
            await prepareEmailDb(client);
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should add email and return its id when success', async () => {
            const result = await sut.addEmail('new@mail.com', 'newmail');
            expect(result).to.not.be.empty;
        });
        it('Should return error when wrong email format', async () => {
            await sut.addEmail('wrongEmail', 'test').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('updateEmail', function () {
        this.timeout(10000);
        var emailId = '';
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            emailId = emails[0].id;
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should update email and return its id when success', async () => {
            const result = await sut.updateEmail(emailId, 'test@mail.com', 'test');
            expect(result).to.not.be.empty;
            expect(result).eq(emailId);
        });
        it('Should return error when wrong id', async () => {
            await sut.updateEmail('wrongId', 'test@mail.com', 'test').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty field', async () => {
            await sut.updateEmail(emailId, '', 'test').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('deleteEmail', function () {
        this.timeout(10000);
        var emailId = '';
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            emailId = emails[0].id;
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should delete email and return its id when success', async () => {
            const result = await sut.deleteEmail(emailId);
            expect(result).to.not.be.empty;
            expect(result).eq(emailId);
        });
        it('Should return error when wrong id', async () => {
            await sut.deleteEmail('wrongId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('setEmailHasUser', function () {
        this.timeout(10000);
        var emailId = '';
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            emailId = emails[0].id;
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should set email has user and return its id when success', async () => {
            const result = await sut.setEmailHasUser(emailId, true);
            expect(result).to.not.be.empty;
            expect(result).eq(emailId);
        });
        it('Should return error when wrong id', async () => {
            await sut.setEmailHasUser('wrongId', true).catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('findEmail', function () {
        this.timeout(10000);
        var email = '';
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            email = emails[0].email;
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should find email and return it when success', async () => {
            const result = await sut.findEmail(email);
            expect(result).to.not.be.empty;
            expect(result.email).eq(email);
        });
        it('Should return error when email not found', async () => {
            await sut.findEmail('notfound@mail.com').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when wrong email format', async () => {
            await sut.findEmail('wrongemail.com').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty email field', async () => {
            await sut.findEmail('').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('findEmailById', function () {
        this.timeout(10000);
        var emailId = '';
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            emailId = emails[0].id;
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should find email and return it when success', async () => {
            const result = await sut.findEmailById(emailId);
            expect(result).to.not.be.empty;
            expect(result.id).eq(emailId);
        });
        it('Should return error when email not found', async () => {
            await sut.findEmailById('notFoundId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty id field', async () => {
            await sut.findEmailById('').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('getAllEmails', function () {
        this.timeout(10000);
        it('Should return list of emails when success', async () => {
            await prepareEmailDb(client);
            const result = await sut.getAllEmails();
            await cleanUpEmailDb(client);
            expect(result).to.not.be.empty;
            expect(result.length).eq(3);
        });
        it('Should return error when no emails found', async () => {
            await sut.getAllEmails().catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    // =========================================================================
    describe('addUser', function () {
        this.timeout(10000);
        beforeEach(async () => {
            await prepareUserDb(client);
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should add user and return its id when success', async () => {
            const result = await sut.addUser('username', 'test@mail.com', 'password', 'admin');
            expect(result).to.not.be.empty;
        });
        it('Should return error when empty field', async () => {
            await sut.addUser('', 'test@mail.com', 'passHash', 'admin').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when wrong email format', async () => {
            await sut.addUser('username', 'wrongEmail.com', 'passHash', 'admin').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('updateUserName', function () {
        this.timeout(10000);
        var userId = '';
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            userId = users[0].id;
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should update user name and return its id when success', async () => {
            const result = await sut.updateUserName(userId, 'username');
            expect(result).to.not.be.empty;
            expect(result).eq(userId);
        });
        it('Should return error when wrong id', async () => {
            await sut.updateUserName('wrongId', 'username').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty username', async () => {
            await sut.updateUserName('wrongId', '').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('updateUserPassword', function () {
        this.timeout(10000);
        var userId = '';
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            userId = users[0].id;
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should update user password and return its id when success', async () => {
            const result = await sut.updateUserPassword(userId, 'password');
            expect(result).to.not.be.empty;
            expect(result).eq(userId);
        });
        it('Should return error when wrong id', async () => {
            await sut.updateUserPassword('wrongId', 'password').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty password', async () => {
            await sut.updateUserPassword(userId, '').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('updateUserRole', function () {
        this.timeout(10000);
        var userId = '';
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            userId = users[0].id;
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should update user role and return its id when success', async () => {
            const result = await sut.updateUserRole(userId, 'role');
            expect(result).to.not.be.empty;
            expect(result).eq(userId);
        });
        it('Should return error when wrong id', async () => {
            await sut.updateUserRole('wrongId', 'role').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty role field', async () => {
            await sut.updateUserRole('wrongId', '').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('deleteUser', function () {
        this.timeout(10000);
        var userId = '';
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            userId = users[0].id;
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should delete user and return its id when success', async () => {
            const result = await sut.deleteUser(userId);
            expect(result).to.not.be.empty;
            expect(result).eq(userId);
        });
        it('Should return error when wrong id', async () => {
            await sut.deleteUser('wrongId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('findUserByEmail', function () {
        this.timeout(10000);
        var userEmail = '';
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            userEmail = users[0].email;
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should find user and return it when success', async () => {
            const result = await sut.findUserByEmail(userEmail);
            expect(result).to.not.be.empty;
            expect(result.email).eq(userEmail);
        });
        it('Should return error when user not found', async () => {
            await sut.findUserByEmail('nouser@mail.com').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when wrong email format', async () => {
            await sut.findUserByEmail('wrongEmail').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty email', async () => {
            await sut.findUserByEmail('').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('findUserById', function () {
        this.timeout(10000);
        var userId = '';
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            userId = users[0].id;
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should find user and return it when success', async () => {
            const result = await sut.findUserById(userId);
            expect(result).to.not.be.empty;
            expect(result.id).eq(userId);
        });
        it('Should return error when no user found', async () => {
            await sut.findUserById('noUserId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty id', async () => {
            await sut.findUserById('').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('getAllUsers', function () {
        this.timeout(10000);
        it('Should return list of users when success', async () => {
            await prepareUserDb(client);
            const result = await sut.getAllUsers();
            await cleanUpUserDb(client);
            expect(result).to.not.be.empty;
            expect(result.length).eq(2);
        });
        it('Should return error when no users found', async () => {
            await sut.getAllUsers().catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('confirmUserRegistration', function () {
        this.timeout(10000);
        var userId = '';
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            userId = users[0].id;
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should confirm user registration when success', async () => {
            const result = await sut.confirmUserRegistration(userId);
            expect(result).to.not.be.empty;
            expect(result).eq(userId);
        });
        it('Should return error when wrong id', async () => {
            await sut.confirmUserRegistration('wrongId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when empty id', async () => {
            await sut.confirmUserRegistration('').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
});
