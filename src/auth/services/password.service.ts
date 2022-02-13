import bcrypt from 'bcryptjs';
import IPasswordService from '../domain/services/password.service.contract';

export default class PasswordService implements IPasswordService {
    constructor(private readonly saltRounds: number = 10) {}

    // =========================================================================
    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    // =========================================================================
    public async comparePasswords(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
