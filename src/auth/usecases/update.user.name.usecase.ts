import IAuthRepository from '../domain/repository/auth.repository.contract';

export default class UpdateUserNameUseCase {
    constructor(private authRepository: IAuthRepository) {}
    public async execute(id: string, username: string): Promise<string> {
        // check if user exists
        const _user = await this.authRepository.findUserById(id).catch((_) => null);
        if (!_user) return Promise.reject('User does not exist');
        // update user role
        await this.authRepository.updateUserName(id, username);

        return _user.id;
    }
}
