import {describe, it, expect, beforeEach, jest} from '@jest/globals';

import Service from './service';

describe('Healthcheck Module', () => {
    describe('Service', () => {
        let repository;
        let service;

        beforeEach(() => {
            repository = {
                health: jest.fn(),
            };
            service = new Service(repository);
        });

        it('ping returns ok', async () => {
            const result = await service.ping();
            expect(result).toEqual({status: 'ok'});
        });

        it('health return server and database status', async () => {
            const dbHealth = {
                connected: true,
                latency: 10,
                pool: {
                    total: 3,
                    idle: 2,
                    waiting: 1,
                },
                error: null,
            };

            repository.health.mockResolvedValueOnce(dbHealth);

            const result = await service.health();
            expect(repository.health).toHaveBeenCalled();
            expect(result).toEqual({
                status: 'ok',
                server: {
                    uptime: expect.any(Number),
                    memoryUsage: expect.any(Object),
                    cpuUsage: expect.any(Object),
                    timestamp: expect.any(String),
                },
                database: dbHealth,
            });
        });
    });
});
