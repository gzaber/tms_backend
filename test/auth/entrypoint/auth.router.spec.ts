import express from 'express';
import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import config from '../../../src/config/config';
import TokenValidator from '../../../src/auth/helpers/token.validator';
import FakeTokenService from '../../auth/helpers/fake.token.service';
import { expect } from 'chai';
import { UserModel } from '../../../src/auth/data/models/user.model';
import { EmailModel } from '../../../src/auth/data/models/email.model';
import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import { cleanUpEmailDb, cleanUpUserDb, prepareEmailDb, prepareUserDb } from '../helpers/helpers';
import AuthRouter from '../../../src/auth/entrypoint/auth.router';
import FakePasswordService from '../helpers/fake.password.service';
import EmailService from '../../../src/auth/services/email.service';

dotenv.config();

describe('AuthRouter', function () {
    this.timeout(10000);
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;
    let app: express.Application;
    let savedUsers: UserModel[] = [];
    let savedEmails: EmailModel[] = [];
    let userId: string;
    let notConfirmedUserId: string;
    let userEmail: string;
    let userPassword: string;
    let emailId: string;
    let email: string;

    before(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        let tokenService = new FakeTokenService();
        let passwordService = new FakePasswordService();
        let emailService = new EmailService();

        app = express();
        app.use(express.json());
        app.use(express.urlencoded());
        app.set('view engine', 'ejs');
        app.use(
            '/auth',
            AuthRouter.configure(
                repository,
                passwordService,
                tokenService,
                emailService,
                new TokenValidator(tokenService)
            )
        );
    });
    beforeEach(async () => {
        savedEmails = await prepareEmailDb(client);
        savedUsers = await prepareUserDb(client);
        userId = savedUsers[0].id;
        notConfirmedUserId = savedUsers[1].id;
        userEmail = savedUsers[0].email;
        userPassword = savedUsers[0].password;
        emailId = savedEmails[0].id;
        email = savedEmails[0].email;
    });
    afterEach(async () => {
        await cleanUpEmailDb(client);
        await cleanUpUserDb(client);
    });
    after(() => {
        client.disconnect();
    });

    // =========================================================================
    describe('POST /auth/register', () => {
        it('Should return status 200 and registered user id when success', async () => {
            await request(app)
                .post('/auth/register')
                .send({ username: 'Username', email: email, password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 when user already registered', async () => {
            await request(app)
                .post('/auth/register')
                .send({ username: 'Username', email: userEmail, password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 404 when email not allowed', async () => {
            await request(app)
                .post('/auth/register')
                .send({ username: 'Username', email: 'notallowed@mail.com', password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 when wrong email format', async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    username: 'Username',
                    email: 'wrongEmail',
                    password: 'password'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
        it('Should return status 422 when empty field', async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    username: '',
                    email: email,
                    password: 'password'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('GET /auth/confirm/registration/:id/:token', () => {
        it('Should return status 200 and render html with success info when success', async () => {
            await request(app)
                .get(`/auth/confirm/registration/${notConfirmedUserId}/token`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(200);
        });
        it('Should return status 404 and render html with failure info when failure', async () => {
            await request(app)
                .get('/auth/confirm/registration/wrongId/token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(404);
        });
    });
    // =========================================================================
    describe('POST /auth/login', () => {
        it('Should return status 200 and token when success', async () => {
            await request(app)
                .post('/auth/login')
                .send({ email: userEmail, password: userPassword })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.token).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong password', async () => {
            await request(app)
                .post('/auth/login')
                .send({ email: userEmail, password: 'wrongPassword' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when email not allowed', async () => {
            await request(app)
                .post('/auth/login')
                .send({ email: 'notallowed@mail.com', password: userPassword })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when wrong email format', async () => {
            await request(app)
                .post('/auth/login')
                .send({ email: 'wrongEmail', password: userPassword })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when empty field', async () => {
            await request(app)
                .post('/auth/login')
                .send({ email: userEmail, password: '' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('POST /auth/forgot/password', () => {
        it('Should return status 200 and user id when success', async () => {
            await request(app)
                .post('/auth/forgot/password')
                .send({ email: userEmail })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when user not found', async () => {
            await request(app)
                .post('/auth/forgot/password')
                .send({ email: 'notfound@mail.com' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when wrong email format', async () => {
            await request(app)
                .post('/auth/forgot/password')
                .send({ email: 'wrongEmail' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when wrong empty email', async () => {
            await request(app)
                .post('/auth/forgot/password')
                .send({ email: '' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });

    // =========================================================================
    describe('GET /auth/reset/password/:id/:token', () => {
        it('Should return status 200 and render html form for reset password when success', async () => {
            await request(app)
                .get(`/auth/reset/password/${userId}/token`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(200);
        });
        it('Should return status 404 and render html with failure info when wrong id', async () => {
            await request(app)
                .get('/auth/reset/password/wrongId/token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(404);
        });
    });
    // =========================================================================
    describe('POST /auth/reset/password/:id/:token', () => {
        it('Should return status 200 and render html with success info when success', async () => {
            await request(app)
                .post(`/auth/reset/password/${userId}/token`)
                .send({ newPassword1: 'password', newPassword2: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(200);
        });
        it('Should return status 404 and render html with failure info when id not found', async () => {
            await request(app)
                .post('/auth/reset/password/wrongId/token')
                .send({ newPassword1: 'password', newPassword2: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(404);
        });
        it('Should return status 404 and render html with failure info when passwords mismatch', async () => {
            await request(app)
                .post(`/auth/reset/password/${userId}/token`)
                .send({ newPassword1: 'password1', newPassword2: 'password2' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(404);
        });
        it('Should return status 422 and render html with failure info when empty field', async () => {
            await request(app)
                .post(`/auth/reset/password/${userId}/token`)
                .send({ newPassword1: '', newPassword2: 'password2' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /html/)
                .expect(422);
        });
    });

    // =========================================================================
    // =========================================================================
    describe('POST /auth/add/email', () => {
        it('Should return status 200 and added email id when success', async () => {
            await request(app)
                .post('/auth/add/email')
                .send({ email: 'email@email.com', role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when wrong email format', async () => {
            await request(app)
                .post('/auth/add/email')
                .send({ email: 'wrongEmail', role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when empty email', async () => {
            await request(app)
                .post('/auth/add/email')
                .send({ email: '', role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('PUT /auth/update/email', () => {
        it('Should return status 200 and updated email id when success', async () => {
            await request(app)
                .put('/auth/update/email')
                .send({ id: emailId, email: 'email@email.com', role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .put('/auth/update/email')
                .send({ id: 'wrongId', email: 'email@email.com', role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when wrong email format', async () => {
            await request(app)
                .put('/auth/update/email')
                .send({ id: emailId, email: 'wrongEmail', role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when empty email', async () => {
            await request(app)
                .put('/auth/update/email')
                .send({ id: emailId, email: '', role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('DELETE /auth/delete/email/:id', () => {
        it('Should return status 200 and deleted email id when success', async () => {
            await request(app)
                .delete(`/auth/delete/email/${emailId}`)
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .delete('/auth/delete/email/wrongId')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('GET /auth/get/all/emails', () => {
        it('Should return status 200 and list of emails', async () => {
            await request(app)
                .get('/auth/get/all/emails')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.emails).to.not.be.empty;
                    expect(res.body.emails.length).eq(3);
                });
        });
        it('Should return status 404 and errors when no emails found', async () => {
            await cleanUpEmailDb(client);
            await request(app)
                .get('/auth/get/all/emails')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
            await prepareEmailDb(client);
        });
    });
    // =========================================================================
    // =========================================================================
    describe('PUT /auth/update/user/name', () => {
        it('Should return status 200 and updated user id when success', async () => {
            await request(app)
                .put('/auth/update/user/name')
                .send({
                    id: userId,
                    username: 'username'
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .put('/auth/update/user/name')
                .send({
                    id: 'wrongId',
                    username: 'username'
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when empty field', async () => {
            await request(app)
                .put('/auth/update/user/name')
                .send({
                    id: userId,
                    username: ''
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('PUT /auth/update/user/password', () => {
        it('Should return status 200 and updated user id when success', async () => {
            await request(app)
                .put('/auth/update/user/password')
                .send({
                    id: userId,
                    oldPassword: userPassword,
                    newPassword1: 'password',
                    newPassword2: 'password'
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .put('/auth/update/user/password')
                .send({
                    id: 'wrongId',
                    oldPassword: userPassword,
                    newPassword1: 'password',
                    newPassword2: 'password'
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when empty field', async () => {
            await request(app)
                .put('/auth/update/user/password')
                .send({
                    id: userId,
                    oldPassword: userPassword,
                    newPassword1: '',
                    newPassword2: 'password'
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong old password', async () => {
            await request(app)
                .put('/auth/update/user/password')
                .send({
                    id: userId,
                    oldPassword: 'oldPassword',
                    newPassword1: 'password',
                    newPassword2: 'password'
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when new passwords mismatch', async () => {
            await request(app)
                .put('/auth/update/user/password')
                .send({
                    id: userId,
                    oldPassword: userPassword,
                    newPassword1: 'password1',
                    newPassword2: 'password2'
                })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('PUT /auth/update/user/role', () => {
        it('Should return status 200 and updated user id when success', async () => {
            await request(app)
                .put('/auth/update/user/role')
                .send({ id: userId, role: 'role' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .put('/auth/update/user/role')
                .send({ id: 'wrongId', status: 'status' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('DELETE /auth/delete/user/:id', () => {
        it('Should return status 200 and deleted user id when success', async () => {
            await request(app)
                .delete(`/auth/delete/user/${userId}`)
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .delete('/auth/delete/user/wrongId')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('GET /auth/find/user/:email', () => {
        it('Should return status 200 and user when success', async () => {
            await request(app)
                .get(`/auth/find/user/${userEmail}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.user).to.not.be.empty;
                    expect(res.body.user.email).eq(userEmail);
                });
        });
        it('Should return status 404 and errors when user not found', async () => {
            await request(app)
                .get('/auth/find/user/nouserfound@email.com')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when wrong email format', async () => {
            await request(app)
                .get('/auth/find/user/wrongEmail')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('GET /auth/get/all/users', () => {
        it('Should return status 200 and list of users when success', async () => {
            await request(app)
                .get('/auth/get/all/users')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.users).to.not.be.empty;
                    expect(res.body.users.length).eq(2);
                });
        });
        it('Should return status 404 and errors when no users found', async () => {
            await cleanUpUserDb(client);
            await request(app)
                .get('/auth/get/all/users')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
            await prepareUserDb(client);
        });
    });
    // =========================================================================
});
