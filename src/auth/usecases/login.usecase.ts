import IAuthRepository from '../domain/repository/auth.repository.contract';
import IPasswordService from '../domain/services/password.service.contract';

export default class LoginUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private passwordService: IPasswordService
    ) {}

    public async execute(email: string, password: string) {
        // check is user is allowed
        const _email = await this.authRepository.findEmail(email).catch((_) => null);
        if (!_email) return Promise.reject('This email is not allowed');
        // check if user exists
        const _user = await this.authRepository.findUserByEmail(email).catch((_) => null);
        // check if user exists and password match
        if (!_user || !(await this.passwordService.comparePasswords(password, _user.password)))
            return Promise.reject('Invalid email or password');
        // check if profile is confirmed
        if (!_user.isConfirmed) return Promise.reject('Profile is not confirmed');

        return _user.id;
    }
}
