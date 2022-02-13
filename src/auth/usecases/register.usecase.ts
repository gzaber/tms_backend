import config from '../../config/config';
import IAuthRepository from '../domain/repository/auth.repository.contract';
import IEmailService from '../domain/services/email.service.contract';
import IPasswordService from '../domain/services/password.service.contract';
import ITokenService from '../domain/services/token.service.contract';

export default class RegisterUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private passwordService: IPasswordService,
        private tokenService: ITokenService,
        private emailService: IEmailService
    ) {}

    public async execute(username: string, email: string, password: string): Promise<string> {
        // check if email is allowed
        const _email = await this.authRepository.findEmail(email).catch((_) => null);
        if (!_email) return Promise.reject('This email is not allowed');
        // check if user exists
        const user = await this.authRepository.findUserByEmail(email).catch((_) => null);
        if (user) return Promise.reject('User already exists');
        // hash password
        const passwordHash = await this.passwordService.hashPassword(password);
        // add user
        const _user = await this.authRepository.addUser(username, email, passwordHash, _email.role);
        // set hasUser in Email
        await this.authRepository.setEmailHasUser(_email.id, true);

        // create temporary token for confirmation
        const secret = config.server.token.secret + _user.isConfirmed;
        const token = this.tokenService.encodeToken(
            _user.id,
            secret,
            config.server.token.confirmationExpireTime
        );
        // send confirmation email
        await this.emailService.sendConfirmationEmail(email, _user.id, token);

        return _user.id;
    }
}
