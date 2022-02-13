import express from 'express';
import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import config from '../../../src/config/config';
import TaskRepository from '../../../src/task/data/repository/task.repository';
import ITaskRepository from '../../../src/task/domain/repository/task.repository.contract';
import { cleanUpTaskDb, prepareTaskDb } from '../helpers/helpers';
import { TaskModel } from '../../../src/task/data/models/task.model';
import TaskRouter from '../../../src/task/entrypoint/task.router';
import TokenValidator from '../../../src/auth/helpers/token.validator';
import FakeTokenService from '../../auth/helpers/fake.token.service';
import { expect } from 'chai';

dotenv.config();

describe('TaskRouter', function () {
    this.timeout(10000);
    let client: mongoose.Mongoose;
    let repository: ITaskRepository;
    let app: express.Application;
    let savedTasks: TaskModel[] = [];
    let taskId: string;

    before(() => {
        client = new mongoose.Mongoose();
        client.connect(config.mongo.url, config.mongo.options);
        repository = new TaskRepository(client);
        let tokenService = new FakeTokenService();
        app = express();
        app.use(express.json());
        app.use(express.urlencoded());
        app.use('/task', TaskRouter.configure(repository, new TokenValidator(tokenService)));
    });
    beforeEach(async () => {
        savedTasks = await prepareTaskDb(client);
        taskId = savedTasks[0].id;
    });
    afterEach(async () => {
        await cleanUpTaskDb(client);
    });
    after(() => {
        client.disconnect();
    });
    // =========================================================================
    describe('POST /task/add', () => {
        const task = {
            name: 'Task name',
            description: 'Task description',
            status: 'todo',
            dateFrom: '2021-12-01',
            dateTo: '2021-12-01',
            color: 4294924066,
            members: ['John', 'Jack']
        };

        it('Should return status 200 and added task id when success', async () => {
            await request(app)
                .post('/task/add')
                .send(task)
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when empty field', async () => {
            task.name = '';
            await request(app)
                .post('/task/add')
                .send(task)
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('PUT /task/update', () => {
        it('Should return status 200 and updated task id when success', async () => {
            var task = {
                id: taskId,
                name: 'Task name',
                description: 'Task description',
                status: 'todo',
                dateFrom: '2021-12-01',
                dateTo: '2021-12-01',
                color: 4294924066,
                members: ['John', 'Jack']
            };
            await request(app)
                .put('/task/update')
                .send(task)
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            var task = {
                id: 'wrongId',
                name: 'Task name',
                description: 'Task description',
                status: 'todo',
                dateFrom: '2021-12-01',
                dateTo: '2021-12-01',
                color: 4294924066,
                members: ['John', 'Jack']
            };
            await request(app)
                .put('/task/update')
                .send(task)
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 422 and errors when empty field', async () => {
            var task = {
                id: taskId,
                name: '',
                description: 'Task description',
                status: 'todo',
                dateFrom: '2021-12-01',
                dateTo: '2021-12-01',
                color: 4294924066,
                members: ['John', 'Jack']
            };
            await request(app)
                .put('/task/update')
                .send(task)
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)
                .then((res) => {
                    expect(res.body.errors).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('PUT /task/update/status', () => {
        it('Should return status 200 and updated task id when success', async () => {
            await request(app)
                .put('/task/update/status')
                .send({ id: taskId, status: 'status' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .put('/task/update/status')
                .send({ id: 'wrongId', status: 'status' })
                .set('Authorization', 'token')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('DELETE /task/delete', () => {
        it('Should return status 200 and deleted task id when success', async () => {
            await request(app)
                .delete(`/task/delete/${taskId}`)
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.id).to.not.be.empty;
                });
        });
        it('Should return status 404 and errors when wrong id', async () => {
            await request(app)
                .delete('/task/delete/wrongId')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('GET /task/get/by/date/range', () => {
        it('Should return status 200 and list of tasks when success', async () => {
            await request(app)
                .get('/task/get/by/date/range/2021-12-01/2021-12-07')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.tasks).to.not.be.empty;
                    expect(res.body.tasks.length).eq(2);
                });
        });
        it('Should return status 404 when no tasks found', async () => {
            await request(app)
                .get('/task/get/by/date/range/2021-11-01/2021-11-07')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
        it('Should return status 404 when wrong date format', async () => {
            await request(app)
                .get('/task/get/by/date/range/dateFrom/dateTo')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
        });
    });
    // =========================================================================
    describe('GET /task/get/all', () => {
        it('Should return status 200 and list of tasks', async () => {
            await request(app)
                .get('/task/get/all')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                    expect(res.body.tasks).to.not.be.empty;
                    expect(res.body.tasks.length).eq(3);
                });
        });
        it('Should return status 404 when no tasks found', async () => {
            await cleanUpTaskDb(client);
            await request(app)
                .get('/task/get/all')
                .set('Authorization', 'token')
                .expect('Content-Type', /json/)
                .expect(404)
                .then((res) => {
                    expect(res.body.error).to.not.be.empty;
                });
            await prepareTaskDb(client);
        });
    });
    // =========================================================================
});
