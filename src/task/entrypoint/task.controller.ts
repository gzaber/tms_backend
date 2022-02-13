import { Request, Response } from 'express';
import ITaskRepository from '../domain/repository/task.repository.contract';
import Task from '../domain/task';

export default class TaskController {
    constructor(private readonly repository: ITaskRepository) {}

    // =========================================================================
    public async addTask(req: Request, res: Response) {
        try {
            const { name, description, status, dateFrom, dateTo, color, members } = req.body;
            return this.repository
                .addTask(name, description, status, dateFrom, dateTo, color, members)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async updateTask(req: Request, res: Response) {
        try {
            const { id, name, description, status, dateFrom, dateTo, color, members } = req.body;
            return this.repository
                .updateTask(id, name, description, status, dateFrom, dateTo, color, members)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async updateTaskStatus(req: Request, res: Response) {
        try {
            const { id, status } = req.body;
            return this.repository
                .updateTaskStatus(id, status)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async deleteTask(req: Request, res: Response) {
        try {
            const { id } = req.params;
            return this.repository
                .deleteTask(id)
                .then((id: string) => res.status(200).json({ id }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async getTasksByDateRange(req: Request, res: Response) {
        try {
            const { dateFrom, dateTo } = req.params;
            return this.repository
                .getTasksByDateRange(dateFrom, dateTo)
                .then((tasks: Task[]) => res.status(200).json({ tasks }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
    public async getAllTasks(req: Request, res: Response) {
        try {
            return this.repository
                .getAllTasks()
                .then((tasks: Task[]) => res.status(200).json({ tasks }))
                .catch((err: Error) => res.status(404).json({ error: err }));
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
    // =========================================================================
}
