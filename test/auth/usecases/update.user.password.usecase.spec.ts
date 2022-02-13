import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpUserDb, prepareUserDb } from '../helpers/helpers';
import { UserModel } from '../../../src/auth/data/models/user.model';
import UpdateUserPasswordUseCase from '../../../src/auth/usecases/update.user.password.usecase';
import IPasswordService from '../../../src/auth/domain/services/password.service.contract';
import FakePasswordService from '../helpers/fake.password.service';

chai.use(chaiAsPromised);
dotenv.config();

describe('UpdateUserPasswordUseCase', () => {
    let sut: UpdateUserPasswordUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;
    let passwordService: IPasswordService;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        passwordService = new FakePasswordService();
        sut = new UpdateUserPasswordUseCase(repository, passwordService);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('UpdateUserPasswordUseCase.execute', function () {
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
            const result = await sut.execute(user.id, user.password, 'newPassword', 'newPassword');
            expect(result).to.not.be.empty;
            expect(result).eq(user.id);
        });
        it('Should throw an error when wrong id', async () => {
            await sut
                .execute('wrongId', user.password, 'newPassword', 'newPassword')
                .catch((err) => {
                    expect(err).to.not.be.empty;
                });
        });
        it('Should throw an error when empty id field', async () => {
            await sut.execute('', user.password, 'newPassword', 'newPassword').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when wrong old password', async () => {
            await sut
                .execute(user.id, 'wrongPassword', 'newPassword', 'newPassword')
                .catch((err) => {
                    expect(err).to.not.be.empty;
                });
        });
        it('Should throw an error when new password mismatch', async () => {
            await sut
                .execute(user.id, user.password, 'newPassword1', 'newPassword2')
                .catch((err) => {
                    expect(err).to.not.be.empty;
                });
        });
        it('Should throw an error when empty field', async () => {
            await sut.execute(user.id, 'oldPassword', '', 'newPassword2').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
