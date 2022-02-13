import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpUserDb, prepareUserDb } from '../helpers/helpers';
import FindUserUseCase from '../../../src/auth/usecases/find.user.usecase';
import { UserModel } from '../../../src/auth/data/models/user.model';

chai.use(chaiAsPromised);
dotenv.config();

describe('FindUserUseCase', () => {
    let sut: FindUserUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new FindUserUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('FindUserUseCase.execute', function () {
        this.timeout(10000);
        var user: UserModel;
        beforeEach(async () => {
            const users = await prepareUserDb(client);
            user = users[0];
        });
        afterEach(async () => {
            await cleanUpUserDb(client);
        });
        it('Should return user when success', async () => {
            const result = await sut.execute(user.email);
            expect(result).to.not.be.empty;
            expect(result.id).eq(user.id);
        });
        it('Should throw an error when no user found', async () => {
            await sut.execute('noUser@email.com').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when wrong email format', async () => {
            await sut.execute('wrongEmail').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when empty email field', async () => {
            await sut.execute('').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
