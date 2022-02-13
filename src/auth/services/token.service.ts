import jwt from 'jsonwebtoken';
import config from '../../config/config';
import ITokenService from '../domain/services/token.service.contract';

export default class TokenService implements ITokenService {
    // =========================================================================
    encodeToken(payload: string | object, secret: string, expiresIn: string): string {
        let token = jwt.sign({ data: payload }, secret, {
            issuer: config.server.token.issuer,
            algorithm: 'HS256',
            expiresIn: expiresIn
        });
        return token;
    }
    // =========================================================================
    decodeToken(token: string, secret: string): string | object {
        try {
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (err) {
            return '';
        }
    }
}
