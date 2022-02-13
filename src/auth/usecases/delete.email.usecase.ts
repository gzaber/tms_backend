import IAuthRepository from '../domain/repository/auth.repository.contract';

export default class DeleteEmailUseCase {
    constructor(private authRepository: IAuthRepository) {}

    public async execute(id: string): Promise<string> {
        // check if email exists
        const _email = await this.authRepository.findEmailById(id).catch((_) => null);
        if (!_email) return Promise.reject('Email does not exist');
        // delete email
        const result = await this.authRepository.deleteEmail(id);

        // delete user if exists
        const _user = await this.authRepository.findUserByEmail(_email.email).catch((_) => null);
        if (_user) {
            await this.authRepository.deleteUser(_user.id);
        }

        return result;
    }
}
