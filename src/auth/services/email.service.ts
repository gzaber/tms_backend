import IEmailService from '../domain/services/email.service.contract';
import nodemailer from 'nodemailer';
import config from '../../config/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default class EmailService implements IEmailService {
    private readonly transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.email.hostname,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.email.username,
                pass: config.email.password
            }
        });
    }
    // =========================================================================
    public async sendConfirmationEmail(email: string, id: string, token: string): Promise<boolean> {
        // create link
        const link = `${config.server.host}/auth/confirm/registration/${id}/${token}`;

        // send mail with defined transport object
        await this.transporter.sendMail({
            from: `"TMS registration" <${config.email.sender}>`, // sender address
            to: email, // list of receivers
            subject: 'Confirm registration', // Subject line
            html: `<a href="${link}"><b>Click to confirm registration</b></a>` // html body
        });

        console.log('CONFIRMATION LINK SEND:\n %s', link);

        return true;
    }
    // =========================================================================
    public async sendForgotPasswordEmail(
        email: string,
        id: string,
        token: string
    ): Promise<boolean> {
        // create link
        const link = `${config.server.host}/auth/reset/password/${id}/${token}`;
        // send mail with defined transport object
        await this.transporter.sendMail({
            from: `"TMS change password" <${config.email.sender}>`, // sender address
            to: email, // list of receivers
            subject: 'Reset profile password', // Subject line
            html: `<a href="${link}"><b>Click to reset password</b></a>` // html body
        });

        console.log('FORGOT PASSWORD LINK SEND:\n %s', link);

        return true;
    }
    // =========================================================================
}
