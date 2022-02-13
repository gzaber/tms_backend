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
import IPasswordService from '../../../src/auth/domain/services/password.service.contract';
import FakePasswordService from '../helpers/fake.password.service';
import SetNewPasswordUseCase from '../../../src/auth/usecases/set.new.password.usecase';

chai.use(chaiAsPromised);
dotenv.config();

describe('SetNewPasswordUseCase', () => {
    let sut: SetNewPasswordUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;
    let tokenService: ITokenService;
    let passwordService: IPasswordService;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        tokenService = new FakeTokenService();
        passwordService = new FakePasswordService();
        sut = new SetNewPasswordUseCase(repository, tokenService, passwordService);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('SetNewPasswordUseCase.execute', function () {
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
            const result = await sut.execute(user.id, 'token', 'newPassword', 'newPassword');
            expect(result).to.not.be.empty;
            expect(result).eq(user.id);
        });
        it('Should throw an error when wrong id', async () => {
            await sut.execute('wrongId', 'token', 'newPassword', 'newPassword').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty id field', async () => {
            await sut.execute('', 'token', 'newPassword', 'newPassword').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty field', async () => {
            await sut.execute(user.id, '', 'newPassword', 'newPassword').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when password mismatch', async () => {
            await sut.execute(user.id, 'token', 'newPassword1', 'newPassword2').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
