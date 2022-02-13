import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpUserDb, prepareUserDb } from '../helpers/helpers';
import { UserModel } from '../../../src/auth/data/models/user.model';
import ITokenService from '../../../src/auth/domain/services/token.service.contract';
import FakeTokenService from '../helpers/fake.token.service';
import ResetPasswordUseCase from '../../../src/auth/usecases/reset.password.usecase';

chai.use(chaiAsPromised);
dotenv.config();

describe('ResetPasswordUseCase', () => {
    let sut: ResetPasswordUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;
    let tokenService: ITokenService;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        tokenService = new FakeTokenService();
        sut = new ResetPasswordUseCase(repository, tokenService);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('ResetPasswordUseCase.execute', function () {
        this.timeout(10000);
        var user: UserModel;
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            user = users[0];
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should return user email when success', async () => {
            const result = await sut.execute(user.id, 'token');
            expect(result).to.not.be.empty;
            expect(result).eq(user.email);
        });
        it('Should throw an error when wrong id', async () => {
            await sut.execute('wrongId', 'token').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty id field', async () => {
            await sut.execute('', 'token').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty token field', async () => {
            await sut.execute(user.id, '').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
