export default interface IEmailService {
    sendConfirmationEmail(email: string, id: string, token: string): Promise<boolean>;
    sendForgotPasswordEmail(email: string, id: string, token: string): Promise<boolean>;
}
