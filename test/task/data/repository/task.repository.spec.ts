import { expect } from 'chai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import config from '../../../../src/config/config';
import TaskRepository from '../../../../src/task/data/repository/task.repository';
import ITaskRepository from '../../../../src/task/domain/repository/task.repository.contract';
import { cleanUpTaskDb, prepareTaskDb } from '../../helpers/helpers';

dotenv.config();

describe('TaskRepository', () => {
    let client: mongoose.Mongoose;
    let sut: ITaskRepository;
    beforeEach(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        sut = new TaskRepository(client);
    });
    afterEach(() => {
        client.disconnect();
    });
    // =========================================================================
    describe('addTask', function () {
        this.timeout(10000);
        beforeEach(async () => {
            await prepareTaskDb(client);
        });
        afterEach(async () => {
            await cleanUpTaskDb(client);
        });
        it('Should add task and return its id when success', async () => {
            const result = await sut.addTask(
                'taskName',
                'taskDescription',
                'todo',
                '2021-12-06',
                '2021-12-07',
                4294951175,
                ['John', 'Mark']
            );
            expect(result).to.not.be.empty;
        });
        it('Should return error when empty field', async () => {
            await sut
                .addTask('', 'taskDescription', 'todo', '2021-12-06', '2021-12-07', 4294951175, [
                    'John',
                    'Mark'
                ])
                .catch((err) => {
                    expect(err).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('updateTask', function () {
        this.timeout(10000);
        var taskId = '';
        beforeEach(async () => {
            const tasks = await prepareTaskDb(client);
            taskId = tasks[0].id;
        });
        afterEach(async () => {
            await cleanUpTaskDb(client);
        });
        it('Should update task and return its id when success', async () => {
            const result = await sut.updateTask(
                taskId,
                'taskName',
                'taskDescription',
                'done',
                '2021-12-06',
                '2021-12-07',
                4294951175,
                ['John', 'Mark']
            );
            expect(result).to.not.be.empty;
            expect(result).eq(taskId);
        });
        it('Should return error when wrong id', async () => {
            await sut
                .updateTask(
                    'wrongId',
                    'taskName',
                    'taskDescription',
                    'todo',
                    '2021-12-06',
                    '2021-12-07',
                    4294951175,
                    ['John', 'Mark']
                )
                .catch((err) => {
                    expect(err).to.not.be.empty;
                });
        });
        it('Should return error when empty field', async () => {
            await sut
                .updateTask(
                    'wrongId',
                    '',
                    'taskDescription',
                    'todo',
                    '2021-12-06',
                    '2021-12-07',
                    4294951175,
                    ['John', 'Mark']
                )
                .catch((err) => {
                    expect(err).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('updateTaskStatus', function () {
        this.timeout(10000);
        var taskId = '';
        beforeEach(async () => {
            const tasks = await prepareTaskDb(client);
            taskId = tasks[0].id;
        });
        afterEach(async () => {
            await cleanUpTaskDb(client);
        });
        it('Should update task status and return its id when success', async () => {
            const result = await sut.updateTaskStatus(taskId, 'done');
            expect(result).to.not.be.empty;
            expect(result).eq(taskId);
        });
        it('Should return error when wrong id', async () => {
            await sut.updateTaskStatus('wrongId', 'done').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('deleteTask', function () {
        this.timeout(10000);
        var taskId = '';
        beforeEach(async () => {
            const tasks = await prepareTaskDb(client);
            taskId = tasks[0].id;
        });
        afterEach(async () => {
            await cleanUpTaskDb(client);
        });
        it('Should delete task and return its id when success', async () => {
            const result = await sut.deleteTask(taskId);
            expect(result).to.not.be.empty;
            expect(result).eq(taskId);
        });
        it('Should return error when wrong id', async () => {
            await sut.deleteTask('wrongId').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('getTasksByDateRange', function () {
        this.timeout(10000);
        beforeEach(async () => {
            await prepareTaskDb(client);
        });
        afterEach(async () => {
            await cleanUpTaskDb(client);
        });
        it('Should return list of tasks by date range when success', async () => {
            const result = await sut.getTasksByDateRange('2021-12-01', '2021-12-07');
            expect(result).to.not.be.empty;
            expect(result.length).eq(2);
        });
        it('Should return error when no tasks found', async () => {
            await sut.getTasksByDateRange('2021-11-01', '2021-11-07').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
        it('Should return error when wrong date format', async () => {
            await sut.getTasksByDateRange('wrongDateFrom', 'wrongDateTo').catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
    describe('getAllTasks', function () {
        this.timeout(10000);
        it('Should return list of tasks when success', async () => {
            await prepareTaskDb(client);
            const result = await sut.getAllTasks();
            await cleanUpTaskDb(client);
            expect(result).to.not.be.empty;
            expect(result.length).eq(3);
        });
        it('Should return error when no tasks found', async () => {
            await sut.getAllTasks().catch((err) => {
                expect(err).to.not.be.empty;
            });
        });
    });
    // =========================================================================
});
