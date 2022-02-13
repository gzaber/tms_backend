import config from '../../config/config';
import IAuthRepository from '../domain/repository/auth.repository.contract';
import IPasswordService from '../domain/services/password.service.contract';
import ITokenService from '../domain/services/token.service.contract';

export default class SetNewPasswordUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private tokenService: ITokenService,
        private passwordService: IPasswordService
    ) {}

    public async execute(
        id: string,
        token: string,
        newPassword1: string,
        newPassword2: string
    ): Promise<string> {
        // check if user with given id exists
        const _user = await this.authRepository.findUserById(id).catch((_) => null);
        if (!_user) return Promise.reject('Invalid email');
        // decode token
        const secret = config.server.token.secret + _user.password;
        const payload = this.tokenService.decodeToken(token, secret);
        if (!payload) return Promise.reject('Invalid email');
        // check if passwords match
        if (newPassword1 !== newPassword2) return Promise.reject('Passwords must be the same');
        // hash password
        const passwordHash = await this.passwordService.hashPassword(newPassword1);
        // update user's password
        const result = await this.authRepository.updateUserPassword(_user.id, passwordHash);

        return result;
    }
}
