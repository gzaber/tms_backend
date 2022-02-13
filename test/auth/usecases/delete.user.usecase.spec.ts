import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpEmailDb, prepareEmailDb, cleanUpUserDb, prepareUserDb } from '../helpers/helpers';
import DeleteUserUseCase from '../../../src/auth/usecases/delete.user.usecase';
import { UserModel } from '../../../src/auth/data/models/user.model';

chai.use(chaiAsPromised);
dotenv.config();

describe('DeleteUserUseCase', () => {
    let sut: DeleteUserUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new DeleteUserUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('DeleteUserUseCase.execute', function () {
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
        it('Should delete user and return its id when success', async () => {
            const result = await sut.execute(user.id);
            expect(result).to.not.be.empty;
            expect(result).eq(user.id);
        });
        it('Should throw an error when wrong id', async () => {
            await sut.execute('wrongId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
