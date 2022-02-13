import { Model, Mongoose } from 'mongoose';
import IAuthRepository from '../../domain/repository/auth.repository.contract';
import Email from '../../domain/email';
import User from '../../domain/user';
import { EmailModel, EmailSchema } from '../models/email.model';
import { UserModel, UserSchema } from '../models/user.model';

export default class AuthRepository implements IAuthRepository {
    private readonly emailModel: Model<EmailModel>;
    private readonly userModel: Model<UserModel>;

    constructor(private readonly client: Mongoose) {
        this.emailModel = this.client.model<EmailModel>('Email', EmailSchema);
        this.userModel = this.client.model<UserModel>('User', UserSchema);
    }

    // =========================================================================
    // EMAIL
    // =========================================================================
    public async addEmail(email: string, role: string): Promise<string> {
        const _email = new this.emailModel({
            email: email.toLowerCase(),
            role
        });
        await _email.save();

        return _email.id;
    }
    // =========================================================================
    public async updateEmail(id: string, email: string, role: string): Promise<string> {
        await this.emailModel.updateOne({ _id: id }, { email, role });

        return id;
    }
    // =========================================================================
    public async deleteEmail(id: string): Promise<string> {
        await this.emailModel.deleteOne({ _id: id });

        return id;
    }
    // =========================================================================
    public async setEmailHasUser(id: string, hasUser: boolean): Promise<string> {
        await this.emailModel.updateOne({ _id: id }, { hasUser });

        return id;
    }
    // =========================================================================
    public async findEmail(email: string): Promise<Email> {
        const _email = await this.emailModel.findOne({
            email: email.toLowerCase()
        });
        if (!_email) return Promise.reject('Email not found');

        return new Email(_email._id, _email.email, _email.role, _email.hasUser);
    }
    // =========================================================================
    public async findEmailById(id: string): Promise<Email> {
        const _email = await this.emailModel.findOne({
            _id: id
        });
        if (!_email) return Promise.reject('Email not found');

        return new Email(_email.id, _email.email, _email.role, _email.hasUser);
    }
    // =========================================================================
    public async getAllEmails(): Promise<Email[]> {
        const _email = await this.emailModel.find().sort({ email: 1 });
        if (!_email) return Promise.reject('No emails found');

        return _email.map((email) => new Email(email.id, email.email, email.role, email.hasUser));
    }
    // =========================================================================
    // USER
    // =========================================================================
    public async addUser(
        username: string,
        email: string,
        passwordHash: string,
        role: string
    ): Promise<User> {
        const _user = new this.userModel({
            username,
            email: email.toLowerCase(),
            password: passwordHash,
            role
        });
        await _user.save();

        return new User(
            _user.id,
            _user.username,
            _user.email,
            _user.password,
            _user.role,
            _user.isConfirmed
        );
    }

    // =========================================================================
    public async updateUserName(id: string, username: string): Promise<string> {
        await this.userModel.updateOne({ _id: id }, { username });

        return id;
    }
    // =========================================================================
    public async updateUserPassword(id: string, password: string): Promise<string> {
        await this.userModel.updateOne({ _id: id }, { password });

        return id;
    }
    // =========================================================================
    public async updateUserRole(id: string, role: string): Promise<string> {
        await this.userModel.updateOne({ _id: id }, { role });

        return id;
    }
    // =========================================================================
    public async deleteUser(id: string): Promise<string> {
        await this.userModel.deleteOne({ _id: id });

        return id;
    }
    // =========================================================================
    public async findUserByEmail(email: string): Promise<User> {
        const _user = await this.userModel.findOne({
            email: email.toLowerCase()
        });
        if (!_user) return Promise.reject('User not found');

        return new User(
            _user.id,
            _user.username,
            _user.email,
            _user.password,
            _user.role,
            _user.isConfirmed
        );
    }
    // =========================================================================
    public async findUserById(id: string): Promise<User> {
        const _user = await this.userModel.findOne({ _id: id });
        if (!_user) return Promise.reject('User not found');

        return new User(
            _user.id,
            _user.username,
            _user.email,
            _user.password,
            _user.role,
            _user.isConfirmed
        );
    }
    // =========================================================================
    public async getAllUsers(): Promise<User[]> {
        const _users = await this.userModel.find().sort({ username: 1 });
        if (!_users) return Promise.reject('No users found');

        return _users.map(
            (user) =>
                new User(
                    user._id,
                    user.username,
                    user.email,
                    user.password,
                    user.role,
                    user.isConfirmed
                )
        );
    }
    // =========================================================================
    public async confirmUserRegistration(id: string): Promise<string> {
        await this.userModel.updateOne({ _id: id }, { isConfirmed: true });

        return id;
    }

    // =========================================================================
}
