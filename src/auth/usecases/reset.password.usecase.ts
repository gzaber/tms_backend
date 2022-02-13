import config from '../../config/config';
import IAuthRepository from '../domain/repository/auth.repository.contract';
import ITokenService from '../domain/services/token.service.contract';

export default class ResetPasswordUseCase {
    constructor(private authRepository: IAuthRepository, private tokenService: ITokenService) {}

    public async execute(id: string, token: string): Promise<string> {
        // check if user with given id exists
        const _user = await this.authRepository.findUserById(id).catch((_) => null);
        if (!_user) return Promise.reject('Invalid email');
        // decode token
        const secret = config.server.token.secret + _user.password;
        const payload = this.tokenService.decodeToken(token, secret);
        if (!payload) return Promise.reject('Invalid email');

        return _user.email;
    }
}
