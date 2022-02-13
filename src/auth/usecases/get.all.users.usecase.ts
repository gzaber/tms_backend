import IAuthRepository from '../domain/repository/auth.repository.contract';
import User from '../domain/user';

export default class GetAllUsersUseCase {
    constructor(private authRepository: IAuthRepository) {}

    public async execute(): Promise<User[]> {
        // get all users
        const _users = await this.authRepository.getAllUsers();
        if (_users.length == 0) return Promise.reject('No users found');

        return _users;
    }
}
