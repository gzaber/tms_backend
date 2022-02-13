import { Model, Mongoose } from 'mongoose';
import ITaskRepository from '../../domain/repository/task.repository.contract';
import Task from '../../domain/task';
import { TaskModel, TaskSchema } from '../models/task.model';

export default class TaskRepository implements ITaskRepository {
    private readonly taskModel: Model<TaskModel>;
    constructor(private readonly client: Mongoose) {
        this.taskModel = this.client.model<TaskModel>('Task', TaskSchema);
    }

    // =========================================================================
    public async addTask(
        name: string,
        description: string,
        status: string,
        dateFrom: string,
        dateTo: string,
        color: number,
        members: string[]
    ): Promise<string> {
        const _task = new this.taskModel({
            name,
            description,
            status,
            dateFrom,
            dateTo,
            color,
            members
        });
        await _task.save();

        return _task.id;
    }
    // =========================================================================
    public async updateTask(
        id: string,
        name: string,
        description: string,
        status: string,
        dateFrom: string,
        dateTo: string,
        color: number,
        members: string[]
    ): Promise<string> {
        await this.taskModel.updateOne(
            { _id: id },
            {
                name,
                description,
                status,
                dateFrom,
                dateTo,
                color,
                members
            }
        );

        return id;
    }
    // =========================================================================
    public async updateTaskStatus(id: string, status: string): Promise<string> {
        await this.taskModel.updateOne({ _id: id }, { status });

        return id;
    }
    // =========================================================================
    public async deleteTask(id: string): Promise<string> {
        await this.taskModel.deleteOne({ _id: id });

        return id;
    }
    // =========================================================================
    public async getTasksByDateRange(dateFrom: string, dateTo: string): Promise<Task[]> {
        const _dateFromTasks = await this.taskModel
            .find({ dateFrom: { $gte: dateFrom, $lte: dateTo } })
            .sort({ dateFrom: -1 });

        const _dateToTasks = await this.taskModel
            .find({ dateTo: { $gte: dateFrom, $lte: dateTo } })
            .sort({ dateTo: -1 });

        if (_dateFromTasks.length == 0 && _dateToTasks.length == 0)
            return Promise.reject('No tasks found');

        const _tasks = _dateFromTasks
            .concat(_dateToTasks)
            .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

        return _tasks.map(
            (task) =>
                new Task(
                    task.id,
                    task.name,
                    task.description,
                    task.status,
                    task.dateFrom,
                    task.dateTo,
                    task.color,
                    task.members
                )
        );
    }
    // =========================================================================
    public async getAllTasks(): Promise<Task[]> {
        const _tasks = await this.taskModel.find().sort({ dateFrom: -1 });
        if (_tasks.length == 0) return Promise.reject('No tasks found');

        return _tasks.map(
            (task) =>
                new Task(
                    task.id,
                    task.name,
                    task.description,
                    task.status,
                    task.dateFrom,
                    task.dateTo,
                    task.color,
                    task.members
                )
        );
    }
    // =========================================================================
}
