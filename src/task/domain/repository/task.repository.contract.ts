import Task from '../task';

export default interface ITaskRepository {
    addTask(
        name: string,
        description: string,
        status: string,
        dateFrom: string,
        dateTo: string,
        color: number,
        members: string[]
    ): Promise<string>;
    updateTask(
        id: string,
        name: string,
        description: string,
        status: string,
        dateFrom: string,
        dateTo: string,
        color: number,
        members: string[]
    ): Promise<string>;
    updateTaskStatus(id: string, status: string): Promise<string>;
    deleteTask(id: string): Promise<string>;
    getTasksByDateRange(dateFrom: string, dateTo: string): Promise<Task[]>;
    getAllTasks(): Promise<Task[]>;
}
