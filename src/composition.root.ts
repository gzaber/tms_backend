import mongoose from 'mongoose';
import AuthRouter from './auth/entrypoint/auth.router';
import TokenValidator from './auth/helpers/token.validator';
import AuthRepository from './auth/data/repository/auth.repository';
import EmailService from './auth/services/email.service';
import PasswordService from './auth/services/password.service';
import TokenService from './auth/services/token.service';
import config from './config/config';
import TaskRouter from './task/entrypoint/task.router';
import TaskRepository from './task/data/repository/task.repository';
import dotenv from 'dotenv';

export default class CompositionRoot {
    private static client: mongoose.Mongoose;

    public static configure() {
        dotenv.config();
        this.client = new mongoose.Mongoose();
        this.client.connect(config.mongo.url, config.mongo.options);
    }

    public static authRouter() {
        const repository = new AuthRepository(this.client);
        const passwordService = new PasswordService();
        const tokenService = new TokenService();
        const emailService = new EmailService();
        const tokenValidator = new TokenValidator(tokenService);

        return AuthRouter.configure(
            repository,
            passwordService,
            tokenService,
            emailService,
            tokenValidator
        );
    }

    public static taskRouter() {
        const tokenService = new TokenService();
        const tokenValidator = new TokenValidator(tokenService);
        const repository = new TaskRepository(this.client);

        return TaskRouter.configure(repository, tokenValidator);
    }
}
