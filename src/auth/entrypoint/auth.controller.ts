import { Request, Response } from 'express';
import config from '../../config/config';
import ITokenService from '../domain/services/token.service.contract';
import Email from '../domain/email';
import User from '../domain/user';
import AddEmailUseCase from '../usecases/add.email.usecase';
import ConfirmRegistrationUseCase from '../usecases/confirm.registration.usecase';
import DeleteEmailUseCase from '../usecases/delete.email.usecase';
import ForgotPasswordUseCase from '../usecases/forgot.password.usecase';
import GetAllEmailsUseCase from '../usecases/get.all.emails.usecase';
import GetAllUsersUseCase from '../usecases/get.all.users.usecase';
import LoginUseCase from '../usecases/login.usecase';
import RegisterUseCase from '../usecases/register.usecase';
import ResetPasswordUseCase from '../usecases/reset.password.usecase';
import UpdateEmailUseCase from '../usecases/update.email.usecase';
import FindUserUseCase from '../usecases/find.user.usecase';
import UpdateUserRoleUseCase from '../usecases/update.user.role.usecase';
import DeleteUserUseCase from '../usecases/delete.user.usecase';
import UpdateUserNameUseCase from '../usecases/update.user.name.usecase';
import SetNewPasswordUseCase from '../usecases/set.new.password.usecase';
import UpdateUserPasswordUseCase from '../usecases/update.user.password.usecase';

export default class AuthController {
    private readonly tokenService: ITokenService;
    private readonly registerUseCase: RegisterUseCase;
    private readonly confirmRegistrationUseCase: ConfirmRegistrationUseCase;
    private readonly loginUseCase: LoginUseCase;
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase;
    private readonly resetPasswordUseCase: ResetPasswordUseCase;
    private readonly setNewPasswordUseCase: SetNewPasswordUseCase;

    private readonly addEmailUseCase: AddEmailUseCase;
    private readonly updateEmailUseCase: UpdateEmailUseCase;
    private readonly deleteEmailUseCase: DeleteEmailUseCase;
    private readonly getAllEmailsUseCase: GetAllEmailsUseCase;
    private readonly updateUserNameUseCase: UpdateUserNameUseCase;
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase;
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase;
    private readonly deleteUserUseCase: DeleteUserUseCase;
    private readonly findUserUseCase: FindUserUseCase;
    private readonly getAllUsersUseCase: GetAllUsersUseCase;

    constructor(
        tokenService: ITokenService,
        registerUseCase: RegisterUseCase,
        confirmRegistrationUseCase: ConfirmRegistrationUseCase,
        loginUseCase: LoginUseCase,
        forgotPasswordUseCase: ForgotPasswordUseCase,
        resetPasswordUseCase: ResetPasswordUseCase,
        setNewPasswordUseCase: SetNewPasswordUseCase,
        addEmailUseCase: AddEmailUseCase,
        updateEmailUseCase: UpdateEmailUseCase,
        deleteEmailUseCase: DeleteEmailUseCase,
        getAllEmailsUseCase: GetAllEmailsUseCase,
        updateUserNameUseCase: UpdateUserNameUseCase,
        updateUserPasswordUseCase: UpdateUserPasswordUseCase,
        updateUserRoleUseCase: UpdateUserRoleUseCase,
        deleteUserUseCase: DeleteUserUseCase,
        findUserUseCase: FindUserUseCase,
        getAllUsersUseCase: GetAllUsersUseCase
    ) {
        this.tokenService = tokenService;
        this.registerUseCase = registerUseCase;
        this.confirmRegistrationUseCase = confirmRegistrationUseCase;
        this.loginUseCase = loginUseCase;
        this.forgotPasswordUseCase = forgotPasswordUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.setNewPasswordUseCase = setNewPasswordUseCase;
        this.addEmailUseCase = addEmailUseCase;
        this.updateEmailUseCase = updateEmailUseCase;
        this.deleteEmailUseCase = deleteEmailUseCase;
        this.getAllEmailsUseCase = getAllEmailsUseCase;
        this.updateUserNameUseCase = updateUserNameUseCase;
        this.updateUserPasswordUseCase = updateUserPasswordUseCase;
        this.updateUserRoleUseCase = updateUserRoleUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.findUserUseCase = findUserUseCase;
        this.getAllUsersUseCase = getAllUsersUseCase;
    }
    // =========================================================================
    public async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            return this.registerUseCase
                .execute(username, email, password)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async confirmRegistration(req: Request, res: Response) {
        try {
            const { id, token } = req.params;
            return this.confirmRegistrationUseCase
                .execute(id, token)
                .then((id: string) => res.status(200).render('info-result', { info: id }))
                .catch((err: Error) => res.status(404).render('info-result', { error: err }));
        } catch (err) {
            return res.status(400).render('info-result', { error: err });
        }
    }
    // =========================================================================
    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            return this.loginUseCase
                .execute(email, password)
                .then((id: string) =>
                    res.status(200).json({
                        token: this.tokenService.encodeToken(
                            id,
                            config.server.token.secret,
                            config.server.token.loginExpireTime
                        )
                    })
                )
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;
        try {
            return this.forgotPasswordUseCase
                .execute(email)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async resetPassword(req: Request, res: Response) {
        const { id, token } = req.params;
        try {
            return this.resetPasswordUseCase
                .execute(id, token)
                .then((email: string) => res.status(200).render('reset-password', { email }))
                .catch((err: Error) => res.status(404).render('info-result', { error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async setNewPassword(req: Request, res: Response) {
        const { id, token } = req.params;
        const { newPassword1, newPassword2 } = req.body;
        try {
            return this.setNewPasswordUseCase
                .execute(id, token, newPassword1, newPassword2)
                .then((id: string) => res.status(200).render('info-result', { info: id }))
                .catch((err: Error) => res.status(404).render('info-result', { error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    // =========================================================================
    public async addEmail(req: Request, res: Response) {
        try {
            const { email, role } = req.body;
            return this.addEmailUseCase
                .execute(email, role)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async updateEmail(req: Request, res: Response) {
        try {
            const { id, email, role } = req.body;
            return this.updateEmailUseCase
                .execute(id, email, role)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async deleteEmail(req: Request, res: Response) {
        try {
            const { id } = req.params;
            return this.deleteEmailUseCase
                .execute(id)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async getAllEmails(req: Request, res: Response) {
        try {
            return this.getAllEmailsUseCase
                .execute()
                .then((emails: Email[]) => res.status(200).json({ emails }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    // =========================================================================
    public async updateUserName(req: Request, res: Response) {
        try {
            const { id, username } = req.body;
            return this.updateUserNameUseCase
                .execute(id, username)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async updateUserPassword(req: Request, res: Response) {
        try {
            const { id, oldPassword, newPassword1, newPassword2 } = req.body;
            return this.updateUserPasswordUseCase
                .execute(id, oldPassword, newPassword1, newPassword2)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async updateUserRole(req: Request, res: Response) {
        try {
            const { id, role } = req.body;
            return this.updateUserRoleUseCase
                .execute(id, role)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            return this.deleteUserUseCase
                .execute(id)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async findUser(req: Request, res: Response) {
        try {
            const { email } = req.params;
            return this.findUserUseCase
                .execute(email)
                .then((user: User) => res.status(200).json({ user }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async getAllUsers(req: Request, res: Response) {
        try {
            return this.getAllUsersUseCase
                .execute()
                .then((users: User[]) => res.status(200).json({ users }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
}
