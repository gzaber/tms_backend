export default interface ITokenService {
    encodeToken(payload: string | object, secret: string, expiresIn: string): string;
    decodeToken(token: string | object, secret: string): string | object;
}
