import { body, check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const taskValidation = () => {
    return [
        body('name', 'Name is required').notEmpty(),
        body('description', 'Description is required').notEmpty()
    ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors: any = [];
    errors
        .array({ onlyFirstError: true })
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({ errors: extractedErrors });
};
