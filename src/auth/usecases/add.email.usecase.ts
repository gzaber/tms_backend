import IAuthRepository from '../domain/repository/auth.repository.contract';

export default class AddEmailUseCase {
    constructor(private authRepository: IAuthRepository) {}

    public async execute(email: string, role: string): Promise<string> {
        // check if email exists
        const _email = await this.authRepository.findEmail(email).catch((_) => null);
        if (_email) return Promise.reject('Email already exists');
        // add email
        const result = await this.authRepository.addEmail(email, role);

        return result;
    }
}
