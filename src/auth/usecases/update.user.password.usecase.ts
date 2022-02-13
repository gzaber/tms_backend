import IAuthRepository from '../domain/repository/auth.repository.contract';
import IPasswordService from '../domain/services/password.service.contract';

export default class UpdateUserPasswordUseCase {
    constructor(
        private authRepository: IAuthRepository,
        private passwordService: IPasswordService
    ) {}

    public async execute(
        id: string,
        oldPassword: string,
        newPassword1: string,
        newPassword2: string
    ): Promise<string> {
        // check if user with given id exists
        const _user = await this.authRepository.findUserById(id).catch((_) => null);
        if (!_user) return Promise.reject('Invalid user id');

        // check if old password match
        if (!(await this.passwordService.comparePasswords(oldPassword, _user.password)))
            return Promise.reject('Invalid old password');

        // check if passwords match
        if (newPassword1 !== newPassword2) return Promise.reject('Passwords must be the same');
        // hash password
        const passwordHash = await this.passwordService.hashPassword(newPassword1);
        // update user's password
        const result = await this.authRepository.updateUserPassword(_user.id, passwordHash);

        return result;
    }
}
