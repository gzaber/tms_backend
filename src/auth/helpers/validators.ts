import { body, param, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

// =============================================================================
export const registerValidation = () => {
    return [
        body('username', 'Name is required').notEmpty(),
        body('email', 'Invalid email').isEmail().normalizeEmail(),
        body('password', 'Password is required (min 6 characters)').isLength({
            min: 6
        })
    ];
};
// =============================================================================
export const loginValidation = () => {
    return [
        body('email', 'Invalid email').isEmail().normalizeEmail(),
        body('password', 'Password is required (min 6 characters)').notEmpty().isLength({ min: 6 })
    ];
};
// =============================================================================
export const emailValidation = () => {
    return [body('email', 'Invalid email').isEmail().normalizeEmail()];
};
// =============================================================================
export const paramEmailValidation = () => {
    return [param('email', 'Invalid email').isEmail().normalizeEmail()];
};
// =============================================================================
export const resetPasswordValidation = () => {
    return [
        body('newPassword1', 'Password is required (min 6 characters)').isLength({
            min: 6
        }),
        body('newPassword2', 'Repeated password is required (min 6 characters)').isLength({
            min: 6
        })
    ];
};
// =============================================================================
export const usernameValidation = () => {
    return [body('username', 'Username cannot be empty').notEmpty()];
};
// =============================================================================
export const updatePasswordValidation = () => {
    return [
        body('oldPassword', 'Old password is required (min 6 characters)').isLength({
            min: 6
        }),
        body('newPassword1', 'New password is required (min 6 characters)').isLength({
            min: 6
        }),
        body('newPassword2', 'Repeated password is required (min 6 characters)').isLength({
            min: 6
        })
    ];
};
// =============================================================================
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

export const validatePasswordReset = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors: any = [];
    errors.array({ onlyFirstError: true }).map((err) => extractedErrors.push('\n' + err.msg))
        .toString;

    return res.status(422).render('info-result', { error: extractedErrors });
};
