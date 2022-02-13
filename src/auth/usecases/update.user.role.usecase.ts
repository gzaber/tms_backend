import IAuthRepository from '../domain/repository/auth.repository.contract';

export default class UpdateUserRoleUseCase {
    constructor(private authRepository: IAuthRepository) {}
    public async execute(id: string, role: string): Promise<string> {
        // check if user exists
        const _user = await this.authRepository.findUserById(id).catch((_) => null);
        if (!_user) return Promise.reject('User does not exist');
        // update user role
        await this.authRepository.updateUserRole(id, role);

        // update role in email
        const _email = await this.authRepository.findEmail(_user.email).catch((_) => null);
        if (_email) {
            await this.authRepository.updateEmail(_email.id, _email.email, role);
        }

        return _user.id;
    }
}
