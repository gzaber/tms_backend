import IAuthRepository from '../domain/repository/auth.repository.contract';
import User from '../domain/user';

export default class FindUserUseCase {
    constructor(private authRepository: IAuthRepository) {}

    public async execute(email: string): Promise<User> {
        // check if user exists
        const _user = await this.authRepository.findUserByEmail(email).catch((_) => null);
        if (!_user) return Promise.reject('User does not exist');

        return _user;
    }
}
