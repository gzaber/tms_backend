import IAuthRepository from '../domain/repository/auth.repository.contract';
import Email from '../domain/email';

export default class GetAllEmailsUseCase {
    constructor(private authRepository: IAuthRepository) {}

    public async execute(): Promise<Email[]> {
        // get all emails
        const _emails = await this.authRepository.getAllEmails();
        if (_emails.length == 0) return Promise.reject('No emails found');

        return _emails;
    }
}
