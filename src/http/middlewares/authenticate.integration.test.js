import {describe, it, expect, beforeAll, afterAll} from '@jest/globals';
import dotenv from 'dotenv';
import express from 'express';

import authenticateMiddleware from './authenticate.js';
import {ERROR} from '../../../common/auth/errors.js';
import {generateFirebaseAuthToken} from '../../../common/auth/generate_firebase_auth_token.js';
import {HTTP_STATUS} from '../../../common/http/status.js';

describe('Auth Middleware - Integration Test', () => {
    let server;
    let port;

    beforeAll(done => {
        dotenv.config();
        server = express();

        server.get('/test', authenticateMiddleware, (req, res) => {
            res.json({user: req.user});
        });

        server = server.listen(0, () => {
            port = server.address().port;
            done();
        });
    });

    afterAll(done => {
        server.close(done);
    });

    it('should return 401 if no authorization header', async () => {
        const res = await fetch(`http://localhost:${port}/test`);
        const body = await res.json();

        expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        expect(body).toEqual({error: ERROR.MISSING_BEARER_TOKEN});
    });

    it('should return 401 if no token', async () => {
        const res = await fetch(`http://localhost:${port}/test`, {
            headers: { Authorization: 'Bearer ' },
        });
        const body = await res.json();

        expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
        expect(body).toEqual({error: ERROR.MISSING_BEARER_TOKEN});
    });

    it('should return 403 if token invalid', async () => {
        const res = await fetch(`http://localhost:${port}/test`, {
            headers: {Authorization: 'Bearer invalid-token'}
        });
        const body = await res.json();

        expect(res.status).toBe(HTTP_STATUS.FORBIDDEN);
        expect(body).toEqual({error: ERROR.INVALID_OR_EXPIRED_BEARER_TOKEN});
    });

    it('should allow access if token is valid', async () => {
        const token = await generateFirebaseAuthToken();
        const res = await fetch(`http://localhost:${port}/test`, {
            headers: {Authorization: `Bearer ${token}`}
        });

        expect(res.status).toBe(HTTP_STATUS.OK);
    });
});
