import IAuthRepository from '../domain/repository/auth.repository.contract';

export default class DeleteUserUseCase {
    constructor(private authRepository: IAuthRepository) {}

    public async execute(id: string): Promise<string> {
        // check if user exists
        const _user = await this.authRepository.findUserById(id).catch((_) => null);
        if (!_user) return Promise.reject('User does not exist');
        // delete user
        const result = await this.authRepository.deleteUser(id);

        // check if email exists
        const _email = await this.authRepository.findEmail(_user.email).catch((_) => null);
        if (!_email) return Promise.reject('Email does not exist');

        await this.authRepository.setEmailHasUser(_email.id, false);

        return result;
    }
}
