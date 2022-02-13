import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpUserDb, prepareUserDb } from '../helpers/helpers';
import GetAllUsersUseCase from '../../../src/auth/usecases/get.all.users.usecase';

chai.use(chaiAsPromised);
dotenv.config();

describe('GetAllUsersUseCase', () => {
    let sut: GetAllUsersUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new GetAllUsersUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('GetAllUsersUseCase.execute', function () {
        this.timeout(10000);
        it('Should return list of users when success', async () => {
            await prepareUserDb(client);
            const result = await sut.execute();
            await cleanUpUserDb(client);
            expect(result).to.not.be.empty;
            expect(result.length).eq(2);
        });
        it('Should throw an error when no users found', async () => {
            await sut.execute().catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
