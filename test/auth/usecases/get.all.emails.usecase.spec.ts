import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpEmailDb, prepareEmailDb } from '../helpers/helpers';
import GetAllEmailsUseCase from '../../../src/auth/usecases/get.all.emails.usecase';

chai.use(chaiAsPromised);
dotenv.config();

describe('GetAllEmailsUseCase', () => {
    let sut: GetAllEmailsUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new GetAllEmailsUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('GetAllEmailsUseCase.execute', function () {
        this.timeout(10000);
        it('Should return list of emails when success', async () => {
            await prepareEmailDb(client);
            const result = await sut.execute();
            await cleanUpEmailDb(client);
            expect(result).to.not.be.empty;
            expect(result.length).eq(3);
        });
        it('Should throw an error when no emails found', async () => {
            await sut.execute().catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
