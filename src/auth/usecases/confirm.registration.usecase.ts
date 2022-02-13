import IAuthRepository from '../domain/repository/auth.repository.contract';
import ITokenService from '../domain/services/token.service.contract';
import config from '../../config/config';

export default class ConfirmRegistrationUseCase {
    constructor(private authRepository: IAuthRepository, private tokenService: ITokenService) {}

    public async execute(id: string, token: string): Promise<string> {
        // check if user exists
        const _user = await this.authRepository.findUserById(id).catch((_) => null);
        if (!_user) return Promise.reject('User does not exists');
        // decode token
        const secret = config.server.token.secret + _user.isConfirmed;
        const payload = this.tokenService.decodeToken(token, secret);
        if (!payload) return Promise.reject('Confirmation error');
        // confirm user registration
        const result = await this.authRepository.confirmUserRegistration(id);

        return result;
    }
}
