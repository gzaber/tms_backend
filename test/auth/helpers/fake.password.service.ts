import bcrypt from 'bcryptjs';
import IPasswordService from '../../../src/auth/domain/services/password.service.contract';

export default class FakePasswordService implements IPasswordService {
    constructor(private readonly saltRounds: number = 10) {}

    // =========================================================================
    public async hashPassword(password: string): Promise<string> {
        return password;
    }
    // =========================================================================
    public async comparePasswords(password: string, hash: string): Promise<boolean> {
        return password == hash;
    }
}
