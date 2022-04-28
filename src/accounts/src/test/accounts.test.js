const request = require('supertest');
const createApp = require('../app');
const {describe, test, beforeEach} = require('@jest/globals');
const {auth, database, messaging} = require('./mocks');

const app = createApp(auth, database, messaging);

const {authenticateService} = auth;
const {createAccount} = database;
const {publishAccountCreated} = messaging;

describe('POST /accounts', () => {
    beforeEach(() => {
        authenticateService.mockReset();
        createAccount.mockReset();
    });

    describe('given a uid, email, username', () => {
        test('should save uid, email and username to the database', async () => {
            await request(app).post('/accounts').send({
                uid: "uid",
                email: "email",
                username: "username"
            });
            const roles = ['USER'];
            expect(authenticateService.mock.calls.length).toBe(1);
            expect(createAccount.mock.calls.length).toBe(1);
            expect(createAccount.mock.calls[0][0]).toBe("uid");
            expect(createAccount.mock.calls[0][1]).toBe("email");
            expect(createAccount.mock.calls[0][2]).toBe("username");
            expect(createAccount.mock.calls[0][3]).toStrictEqual(roles);
            expect(publishAccountCreated.mock.calls.length).toBe(1);
        });
    });
});
