import { NextFunction, Request, Response } from 'express';
import config from '../../config/config';
import ITokenService from '../domain/services/token.service.contract';

export default class TokenValidator {
    constructor(private readonly tokenService: ITokenService) {}

    public async validate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Authorization header required' });
        if (!this.tokenService.decodeToken(authHeader, config.server.token.secret))
            return res.status(403).json({ error: 'Unauthorized' });

        next();
    }
}
