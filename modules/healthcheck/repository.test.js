import {describe, it, expect, beforeEach, jest} from '@jest/globals';

import Repository from './repository';

describe('Healthcheck Module', () => {
    describe('Repository', () => {
        let db;
        let repository;

        beforeEach(() => {
            db = {
                query: jest.fn(),
                totalCount: 3,
                idleCount: 2,
                waitingCount: 1,
            };
            repository = new Repository(db);
        });

        it('succeeds to query db health information', async () => {
            db.query.mockResolvedValueOnce({rows: [{'?column?': 1}]});

            const result = await repository.health();

            expect(db.query).toHaveBeenCalledWith('SELECT 1');
            expect(result).toEqual({
                connected: true,
                latency: expect.any(Number),
                pool: {
                    total: 3,
                    idle: 2,
                    waiting: 1,
                },
                error: null,
            });
        });

        it('fails to query db health information', async () => {
            db.query.mockRejectedValueOnce(new Error('error'));

            const result = await repository.health();

            expect(db.query).toHaveBeenCalledWith('SELECT 1');
            expect(result).toEqual({
                connected: false,
                latency: null,
                pool: {
                    total: null,
                    idle: null,
                    waiting: null,
                },
                error: 'error',
            });
        });

        it('fails with unknown error', async () => {
            db.query.mockRejectedValueOnce(undefined);

            const result = await repository.health();

            expect(db.query).toHaveBeenCalledWith('SELECT 1');
            expect(result).toEqual({
                connected: false,
                latency: null,
                pool: {
                    total: null,
                    idle: null,
                    waiting: null,
                },
                error: 'Unknown error',
            });
        });
    });
});