import config from '../../config/config';
import IAuthRepository from '../domain/repository/auth.repository.contract';
import IEmailService from '../domain/services/email.service.contract';
import ITokenService from '../domain/services/token.service.contract';

export default class ForgotPasswordUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private tokenService: ITokenService,
        private emailService: IEmailService
    ) {}

    public async execute(email: string): Promise<string> {
        // check if user with given email exists
        const _user = await this.authRepository.findUserByEmail(email).catch((_) => null);
        if (!_user) return Promise.reject('Invalid email');
        // create one time link
        const secret = config.server.token.secret + _user.password;
        const payload = { id: _user.id };
        const token = this.tokenService.encodeToken(
            payload,
            secret,
            config.server.token.confirmationExpireTime
        );
        // send email with link to reset password
        await this.emailService.sendForgotPasswordEmail(email, _user.id, token);

        return _user.id;
    }
}
