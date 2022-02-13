import express from 'express';
import { Request, Response, NextFunction } from 'express';
import TokenValidator from '../../auth/helpers/token.validator';
import ITaskRepository from '../domain/repository/task.repository.contract';
import { taskValidation, validate } from '../helpers/validators';
import TaskController from './task.controller';

export default class TaskRouter {
    public static configure(
        repository: ITaskRepository,
        tokenValidator: TokenValidator
    ): express.Router {
        const router = express.Router();
        let controller = new TaskController(repository);

        // =====================================================================
        router.post(
            '/add',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            taskValidation(),
            validate,
            (req: Request, res: Response) => controller.addTask(req, res)
        );
        // =====================================================================
        router.put(
            '/update',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            taskValidation(),
            validate,
            (req: Request, res: Response) => controller.updateTask(req, res)
        );
        // =====================================================================
        router.put(
            '/update/status',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.updateTaskStatus(req, res)
        );
        // =====================================================================
        router.delete(
            '/delete/:id',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.deleteTask(req, res)
        );
        // =====================================================================
        router.get(
            '/get/by/date/range/:dateFrom/:dateTo',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.getTasksByDateRange(req, res)
        );
        // =====================================================================
        router.get(
            '/get/all',
            (req: Request, res: Response, next: NextFunction) =>
                tokenValidator.validate(req, res, next),
            (req: Request, res: Response) => controller.getAllTasks(req, res)
        );
        // =====================================================================

        return router;
    }
}
