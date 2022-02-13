import ITokenService from '../../../src/auth/domain/services/token.service.contract';

export default class FakeTokenService implements ITokenService {
    // =========================================================================
    encodeToken(payload: string, secret: string, expiresIn: string): string {
        return payload;
    }
    // =========================================================================
    decodeToken(token: string, secret: string): string | object {
        return token;
    }
}
