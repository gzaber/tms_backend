import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpEmailDb, cleanUpUserDb, prepareEmailDb, prepareUserDb } from '../helpers/helpers';
import ITokenService from '../../../src/auth/domain/services/token.service.contract';
import FakeTokenService from '../helpers/fake.token.service';
import IEmailService from '../../../src/auth/domain/services/email.service.contract';
import EmailService from '../../../src/auth/services/email.service';
import ForgotPasswordUseCase from '../../../src/auth/usecases/forgot.password.usecase';
import { UserModel } from '../../../src/auth/data/models/user.model';
import IPasswordService from '../../../src/auth/domain/services/password.service.contract';
import LoginUseCase from '../../../src/auth/usecases/login.usecase';
import FakePasswordService from '../helpers/fake.password.service';

chai.use(chaiAsPromised);
dotenv.config();

describe('LoginUseCase', () => {
    let sut: LoginUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;
    let passwordService: IPasswordService;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        passwordService = new FakePasswordService();
        sut = new LoginUseCase(repository, passwordService);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('LoginUseCase.execute', function () {
        this.timeout(10000);
        var user: UserModel;
        beforeEach(async () => {
            await prepareEmailDb(client);
            const users = await prepareUserDb(client);
            user = users[0];
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
            await cleanUpUserDb(client);
        });

        it('Should return user id when success', async () => {
            const result = await sut.execute(user.email, user.password);
            expect(result).to.not.be.empty;
            expect(result).eq(user.id);
        });
        it('Should throw an error when wrong user email', async () => {
            await sut.execute('wrongEmail', user.password).catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when wrong user password', async () => {
            await sut.execute(user.email, 'wrongPassword').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty email', async () => {
            await sut.execute('', user.password).catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty password', async () => {
            await sut.execute(user.email, '').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
