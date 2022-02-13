import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpUserDb, prepareUserDb } from '../helpers/helpers';
import { UserModel } from '../../../src/auth/data/models/user.model';
import UpdateUserRoleUseCase from '../../../src/auth/usecases/update.user.role.usecase';

chai.use(chaiAsPromised);
dotenv.config();

describe('UpdateUserRoleUseCase', () => {
    let sut: UpdateUserRoleUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new UpdateUserRoleUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('UpdateUserRoleUseCase.execute', function () {
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
            const result = await sut.execute(user.id, 'role');
            expect(result).to.not.be.empty;
            expect(result).eq(user.id);
        });
        it('Should throw an error when wrong id', async () => {
            await sut.execute('wrongId', 'role').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty role field', async () => {
            await sut.execute(user.id, '').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
