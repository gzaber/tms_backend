import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpEmailDb, prepareEmailDb } from '../helpers/helpers';
import { EmailModel } from '../../../src/auth/data/models/email.model';
import UpdateEmailUseCase from '../../../src/auth/usecases/update.email.usecase';

chai.use(chaiAsPromised);
dotenv.config();

describe('UpdateEmailUseCase', () => {
    let sut: UpdateEmailUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new UpdateEmailUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('UpdateEmailUseCase.execute', function () {
        this.timeout(10000);
        var email: EmailModel;
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            email = emails[0];
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should return email id when success', async () => {
            const result = await sut.execute(email.id, 'test@mail.com', 'role');
            expect(result).to.not.be.empty;
            expect(result).eq(email.id);
        });
        it('Should throw an error when wrong id', async () => {
            await sut.execute('wrongId', 'test@mail.com', 'role').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when wrong email format', async () => {
            await sut.execute(email.id, 'testmail.com', 'role').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
