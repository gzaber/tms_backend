import IAuthRepository from '../../../src/auth/domain/repository/auth.repository.contract';
import AddEmailUseCase from '../../../src/auth/usecases/add.email.usecase';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../../../src/config/config';
import AuthRepository from '../../../src/auth/data/repository/auth.repository';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { cleanUpEmailDb, prepareEmailDb } from '../helpers/helpers';
import { EmailModel } from '../../../src/auth/data/models/email.model';

chai.use(chaiAsPromised);
dotenv.config();

describe('AddEmailUseCase', () => {
    let sut: AddEmailUseCase;
    let client: mongoose.Mongoose;
    let repository: IAuthRepository;

    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new AuthRepository(client);
        sut = new AddEmailUseCase(repository);
    });

    afterEach(() => {
        client.disconnect();
    });

    describe('AddEmailUseCase.execute', function () {
        this.timeout(10000);
        var email: EmailModel;
        beforeEach(async () => {
            const emails = await prepareEmailDb(client);
            email = emails[0];
        });
        afterEach(async () => {
            await cleanUpEmailDb(client);
        });
        it('Should add email and return its id when success', async () => {
            const result = await sut.execute('new@mail.com', 'role');
            expect(result).to.not.be.empty;
        });
        it('Should throw an error when email already exists', async () => {
            await sut.execute(email.email, 'role').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should throw an error when email is not correct', async () => {
            await sut.execute('testmail.com', 'role').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
});
