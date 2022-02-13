import { Mongoose } from 'mongoose';
import { TaskModel, TaskSchema } from '../../../src/task/data/models/task.model';

// =============================================================================
export const prepareTaskDb = async (client: Mongoose) => {
    const model = client.model<TaskModel>('Task', TaskSchema);
    await model.ensureIndexes();
    const taskModels = await model.insertMany(tasks);

    return taskModels;
};
// =============================================================================
export const cleanUpTaskDb = async (client: Mongoose) => {
    await client.connection.dropCollection('tasks');
};
// =============================================================================
const tasks = [
    {
        name: 'Task name 1',
        description: 'Task description 1',
        status: 'todo',
        dateFrom: '2021-12-01',
        dateTo: '2021-12-01',
        color: 4294924066,
        members: ['John', 'Jack']
    },
    {
        name: 'Task name 2',
        description: 'Task description 2',
        status: 'todo',
        dateFrom: '2021-12-06',
        dateTo: '2021-12-07',
        color: 4294951175,
        members: ['John', 'Jack']
    },
    {
        name: 'Task name 3',
        description: 'Task description 3',
        status: 'todo',
        dateFrom: '2021-12-13',
        dateTo: '2021-12-15',
        color: 4293467747,
        members: ['John', 'Jack']
    }
];
