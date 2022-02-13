import Email from '../email';
import User from '../user';

export default interface IAuthRepository {
    // =========================================================================
    addEmail(email: string, role: string): Promise<string>;
    updateEmail(id: string, email: string, role: string): Promise<string>;
    deleteEmail(id: string): Promise<string>;
    setEmailHasUser(id: string, hasUser: boolean): Promise<string>;
    findEmail(email: string): Promise<Email>;
    findEmailById(id: string): Promise<Email>;
    getAllEmails(): Promise<Email[]>;
    // =========================================================================
    addUser(username: string, email: string, passwordHash: string, role: string): Promise<User>;
    updateUserName(id: string, username: string): Promise<string>;
    updateUserPassword(id: string, password: string): Promise<string>;
    updateUserRole(id: string, role: string): Promise<string>;
    deleteUser(id: string): Promise<string>;
    findUserByEmail(email: string): Promise<User>;
    findUserById(id: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    confirmUserRegistration(id: string): Promise<string>;
    // =========================================================================
}
