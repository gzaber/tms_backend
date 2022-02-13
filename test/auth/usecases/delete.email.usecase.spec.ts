import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpEmailDb, prepareEmailDb } from '../helpers/helpers';
import { EmailModel } from '../../../src/auth/data/models/email.model';
import DeleteEmailUseCase from '../../../src/auth/usecases/delete.email.usecase';

chai.use(chaiAsPromised);
dotenv.config();

describe('DeleteEmailUseCase', () => {
    let sut: DeleteEmailUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new DeleteEmailUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('DeleteEmailUseCase.execute', function () {
        this.timeout(10000);
        var email: EmailModel;
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            email = emails[0];
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should delete email and return its id when success', async () => {
            const result = await sut.execute(email.id);
            expect(result).to.not.be.empty;
            expect(result).eq(email.id);
        });
        it('Should throw an error when wrong id', async () => {
            await sut.execute('wrongId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
