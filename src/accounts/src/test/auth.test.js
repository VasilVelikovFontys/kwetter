const request = require('supertest');
const createApp = require('../app');
const {describe, test, beforeEach} = require('@jest/globals');
const {auth} = require('./mocks');

const app = createApp(auth);

const {registerUser, authenticateUser} = auth;

describe('POST /auth/register', () => {
    beforeEach(() => {
       registerUser.mockReset();
    });

    describe('given an email and password', () => {
        test('should save the email and password to the auth provider', async () => {
           await request(app).post('/auth/register').send({
               email: "email",
               password: "password"
           });
           expect(registerUser.mock.calls.length).toBe(1);
           expect(registerUser.mock.calls[0][0]).toBe("email");
           expect(registerUser.mock.calls[0][1]).toBe("password");
        });

        test('should respond with a 201 status code', async () => {
            const response = await request(app).post('/auth/register').send({
                email: "email",
                password: "password"
            });
            expect(response.statusCode).toBe(201);
        });

        test('should specify json in the content type header', async () => {
            const response = await request(app).post('/auth/register').send({
                email: "email",
                password: "password"
            });
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        test('should respond with a json object containing a unique user id', async () => {
            registerUser.mockResolvedValue(1);
            const response = await request(app).post('/auth/register').send({
                email: "email",
                password: "password"
            });
            expect(response.body.uid).toBe(1);
        });
    });

    describe('when the email or password is missing', () => {
        test('should respond with a 400 status code', async () => {
            const bodyData = [
                {email: "email"},
                {password: "password"},
                {}
            ];
            for (const body of bodyData) {
                const response = await request(app).post('/auth/register').send(body);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});

describe('POST /auth/authenticate', () => {
    beforeEach(() => {
        authenticateUser.mockReset();
    });

    describe('given an email and password', () => {
        test('should retrieve account from auth provider', async () => {
            await request(app).post('/auth/authenticate').send({
                email: "email",
                password: "password"
            });
            expect(authenticateUser.mock.calls.length).toBe(1);
            expect(authenticateUser.mock.calls[0][0]).toBe("email");
            expect(authenticateUser.mock.calls[0][1]).toBe("password");
        });

        test('should respond with a 200 status code', async () => {
            const response = await request(app).post('/auth/authenticate').send({
                email: "email",
                password: "password"
            });
            expect(response.statusCode).toBe(200);
        });

        test('should specify json in the content type header', async () => {
            const response = await request(app).post('/auth/authenticate').send({
                email: "email",
                password: "password"
            });
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

        test('should respond with a json object containing a unique user id', async () => {
            authenticateUser.mockResolvedValue(1);
            const response = await request(app).post('/auth/authenticate').send({
                email: "email",
                password: "password"
            });
            expect(response.body.uid).toBe(1);
        });
    });

    describe('when the email or password is missing', () => {
        test('should respond with a 400 status code', async () => {
            const bodyData = [
                {email: "email"},
                {password: "password"},
                {}
            ];
            for (const body of bodyData) {
                const response = await request(app).post('/auth/authenticate').send(body);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});
