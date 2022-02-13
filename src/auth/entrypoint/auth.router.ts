import express from 'express';
import { Request, Response, NextFunction } from 'express';
import IAuthRepository from '../domain/repository/auth.repository.contract';
import IEmailService from '../domain/services/email.service.contract';
import IPasswordService from '../domain/services/password.service.contract';
import ITokenService from '../domain/services/token.service.contract';
import TokenValidator from '../helpers/token.validator';
import {
    paramEmailValidation,
    emailValidation,
    loginValidation,
    registerValidation,
    resetPasswordValidation,
    updatePasswordValidation,
    usernameValidation,
    validate,
    validatePasswordReset
} from '../helpers/validators';
import AddEmailUseCase from '../usecases/add.email.usecase';
import ConfirmRegistrationUseCase from '../usecases/confirm.registration.usecase';
import DeleteEmailUseCase from '../usecases/delete.email.usecase';
import DeleteUserUseCase from '../usecases/delete.user.usecase';
import FindUserUseCase from '../usecases/find.user.usecase';
import ForgotPasswordUseCase from '../usecases/forgot.password.usecase';
import GetAllEmailsUseCase from '../usecases/get.all.emails.usecase';
import GetAllUsersUseCase from '../usecases/get.all.users.usecase';
import LoginUseCase from '../usecases/login.usecase';
import RegisterUseCase from '../usecases/register.usecase';
import ResetPasswordUseCase from '../usecases/reset.password.usecase';
import UpdateEmailUseCase from '../usecases/update.email.usecase';
import UpdateUserNameUseCase from '../usecases/update.user.name.usecase';
import UpdateUserRoleUseCase from '../usecases/update.user.role.usecase';
import AuthController from './auth.controller';
import SetNewPasswordUseCase from '../usecases/set.new.password.usecase';
import UpdateUserPasswordUseCase from '../usecases/update.user.password.usecase';

export default class AuthRouter {
    public static configure(
        authRepository: IAuthRepository,
        passwordService: IPasswordService,
        tokenService: ITokenService,
        emailService: IEmailService,
        tokenValidator: TokenValidator
    ): express.Router {
        const router = express.Router();
        let controller = AuthRouter.composeController(
            authRepository,
            passwordService,
            tokenService,
            emailService
        );
        // =====================================================================
        router.post('/register', registerValidation(), validate, (req: Request, res: Response) =>
            controller.register(req, res)
        );
        // =====================================================================
        router.get('/confirm/registration/:id/:token', (req: Request, res: Response) =>
            controller.confirmRegistration(req, res)
        );
        // =====================================================================
        router.post('/login', loginValidation(), validate, (req: Request, res: Response) =>
            controller.login(req, res)
        );
        // =====================================================================
        router.post(
            '/forgot/password',
            emailValidation(),
            validate,
            (req: Request, res: Response) => controller.forgotPassword(req, res)
        );
        // =====================================================================
        router.get('/reset/password/:id/:token', (req: Request, res: Response) =>
            controller.resetPassword(req, res)
        );
        // =====================================================================
        router.post(
            '/reset/password/:id/:token',
            resetPasswordValidation(),
            validatePasswordReset,
            (req: Request, res: Response) => controller.setNewPassword(req, res)
        );
        // =====================================================================
        // =====================================================================
        router.post(
            '/add/email',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            emailValidation(),
            validate,
            (req: Request, res: Response) => controller.addEmail(req, res)
        );
        // =====================================================================
        router.put(
            '/update/email',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            emailValidation(),
            validate,
            (req: Request, res: Response) => controller.updateEmail(req, res)
        );
        // =====================================================================
        router.delete(
            '/delete/email/:id',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.deleteEmail(req, res)
        );
        // =====================================================================
        router.get(
            '/get/all/emails',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.getAllEmails(req, res)
        );
        // =====================================================================
        // =====================================================================
        router.put(
            '/update/user/name',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            usernameValidation(),
            validate,
            (req: Request, res: Response) => controller.updateUserName(req, res)
        );
        // =====================================================================
        router.put(
            '/update/user/password',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            updatePasswordValidation(),
            validate,
            (req: Request, res: Response) => controller.updateUserPassword(req, res)
        );
        // =====================================================================
        router.put(
            '/update/user/role',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.updateUserRole(req, res)
        );
        // =====================================================================
        router.delete(
            '/delete/user/:id',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.deleteUser(req, res)
        );
        // =====================================================================
        router.get(
            '/find/user/:email',
            paramEmailValidation(),
            validate,
            (req: Request, res: Response) => controller.findUser(req, res)
        );
        // =====================================================================
        router.get(
            '/get/all/users',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.getAllUsers(req, res)
        );

        // =====================================================================
        // =====================================================================

        return router;
    }

    private static composeController(
        authRepository: IAuthRepository,
        passwordService: IPasswordService,
        tokenService: ITokenService,
        emailService: IEmailService
    ): AuthController {
        const registerUseCase = new RegisterUseCase(
            authRepository,
            passwordService,
            tokenService,
            emailService
        );
        const confirmRegistrationUseCase = new ConfirmRegistrationUseCase(
            authRepository,
            tokenService
        );
        const loginUseCase = new LoginUseCase(authRepository, passwordService);
        const forgotPasswordUseCase = new ForgotPasswordUseCase(
            authRepository,
            tokenService,
            emailService
        );
        const resetPasswordUseCase = new ResetPasswordUseCase(authRepository, tokenService);
        const setNewPasswordUseCase = new SetNewPasswordUseCase(
            authRepository,
            tokenService,
            passwordService
        );
        const addEmailUseCase = new AddEmailUseCase(authRepository);
        const updateEmailUseCase = new UpdateEmailUseCase(authRepository);
        const deleteEmailUseCase = new DeleteEmailUseCase(authRepository);
        const getAllEmailsUseCase = new GetAllEmailsUseCase(authRepository);

        const updateUserNameUseCase = new UpdateUserNameUseCase(authRepository);
        const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
            authRepository,
            passwordService
        );
        const updateUserRoleUseCase = new UpdateUserRoleUseCase(authRepository);
        const deleteUserUseCase = new DeleteUserUseCase(authRepository);
        const findUserUseCase = new FindUserUseCase(authRepository);
        const getAllUsersUseCase = new GetAllUsersUseCase(authRepository);

        const controller = new AuthController(
            tokenService,
            registerUseCase,
            confirmRegistrationUseCase,
            loginUseCase,
            forgotPasswordUseCase,
            resetPasswordUseCase,
            setNewPasswordUseCase,
            addEmailUseCase,
            updateEmailUseCase,
            deleteEmailUseCase,
            getAllEmailsUseCase,
            updateUserNameUseCase,
            updateUserPasswordUseCase,
            updateUserRoleUseCase,
            deleteUserUseCase,
            findUserUseCase,
            getAllUsersUseCase
        );

        return controller;
    }
}
