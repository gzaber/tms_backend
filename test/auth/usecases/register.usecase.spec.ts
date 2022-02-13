import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpEmailDb, prepareEmailDb } from '../helpers/helpers';
import ITokenService from '../../../src/auth/domain/services/token.service.contract';
import FakeTokenService from '../helpers/fake.token.service';
import IEmailService from '../../../src/auth/domain/services/email.service.contract';
import EmailService from '../../../src/auth/services/email.service';
import RegisterUseCase from '../../../src/auth/usecases/register.usecase';
import IPasswordService from '../../../src/auth/domain/services/password.service.contract';
import FakePasswordService from '../helpers/fake.password.service';
import { EmailModel } from '../../../src/auth/data/models/email.model';

chai.use(chaiAsPromised);
dotenv.config();

describe('RegisterUseCase', () => {
    let sut: RegisterUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;
    let tokenService: ITokenService;
    let emailService: IEmailService;
    let passwordService: IPasswordService;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        tokenService = new FakeTokenService();
        emailService = new EmailService();
        passwordService = new FakePasswordService();
        sut = new RegisterUseCase(repository, passwordService, tokenService, emailService);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('RegisterUseCase.execute', function () {
        this.timeout(10000);
        var email: EmailModel;
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            email = emails[0];
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });

        it('Should return user id when success', async () => {
            const result = await sut.execute('username', email.email, 'password');
            expect(result).to.not.be.empty;
        });
        it('Should throw an error when email not allowed', async () => {
            await sut.execute('username', 'notallowed@mail.com', 'password').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when wrong email format', async () => {
            await sut.execute('username', 'wrongEmail', 'password').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty field', async () => {
            await sut.execute('', 'wrongEmail', 'password').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
