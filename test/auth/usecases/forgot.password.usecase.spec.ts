import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpUserDb, prepareUserDb } from '../helpers/helpers';
import ITokenService from '../../../src/auth/domain/services/token.service.contract';
import FakeTokenService from '../helpers/fake.token.service';
import IEmailService from '../../../src/auth/domain/services/email.service.contract';
import EmailService from '../../../src/auth/services/email.service';
import ForgotPasswordUseCase from '../../../src/auth/usecases/forgot.password.usecase';
import { UserModel } from '../../../src/auth/data/models/user.model';

chai.use(chaiAsPromised);
dotenv.config();

describe('ForgotPasswordUseCase', () => {
    let sut: ForgotPasswordUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;
    let tokenService: ITokenService;
    let emailService: IEmailService;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        tokenService = new FakeTokenService();
        emailService = new EmailService();
        sut = new ForgotPasswordUseCase(repository, tokenService, emailService);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('ForgotPasswordUseCase.execute', function () {
        this.timeout(10000);
        var user: UserModel;
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            user = users[0];
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });

        it('Should return user id when success', async () => {
            const result = await sut.execute(user.email);
            expect(result).to.not.be.empty;
            expect(result).eq(user.id);
        });
        it('Should throw an error when wrong id', async () => {
            await sut.execute('wrongId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty id', async () => {
            await sut.execute('').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
