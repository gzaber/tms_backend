import IAuthRepository from '../domain/repository/auth.repository.contract';

export default class UpdateEmailUseCase {
    constructor(private authRepository: IAuthRepository) {}

    public async execute(id: string, email: string, role: string): Promise<string> {
        // check if email exists
        const _email = await this.authRepository.findEmailById(id).catch((_) => null);
        if (!_email) return Promise.reject('Email does not exist');
        // update email
        await this.authRepository.updateEmail(id, email, role);

        // update user role if user exists
        const _user = await this.authRepository.findUserByEmail(_email.email).catch((_) => null);
        if (_user) {
            await this.authRepository.updateUserRole(_user.id, role);
        }

        return _email.id;
    }
}
