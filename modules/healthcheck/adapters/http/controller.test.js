import {describe, it, expect, beforeEach, jest} from '@jest/globals';

import Controller from './controller';
import {HTTP_STATUS} from '../../../../common/http/status.js';

describe('Healtcheck Module', () => {
    describe('Controller', () => {
        let service;
        let controller;
        let request;
        let response;

        beforeEach(() => {
            service = {
                ping: jest.fn(),
                health: jest.fn(),
            };

            controller = new Controller(service);

            request = {body: {}};
            response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
        });


        describe('ping', () => {
            it('should return 200 and service response on success', async () => {
                const resData = {status: 'ok'};
                service.ping.mockResolvedValueOnce(resData);

                await controller.ping(request, response);

                expect(service.ping).toHaveBeenCalledWith(request.body);
                expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(response.json).toHaveBeenCalledWith(resData);
            });

            it('should return 500 and error message on failure', async () => {
                const error = new Error('error');
                service.ping.mockRejectedValueOnce(error);

                await controller.ping(request, response);

                expect(service.ping).toHaveBeenCalledWith(request.body);
                expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                expect(response.json).toHaveBeenCalledWith({error: error.message});
            });
        });

        describe('health', () => {
            it('should return 200 and service response on success', async () => {
                const resData = { status: 'ok' };
                service.health.mockResolvedValue(resData);

                await controller.health(request, response);

                expect(service.health).toHaveBeenCalledWith(request.body);
                expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(response.json).toHaveBeenCalledWith(resData);
            });

            it('should return 500 and error message on failure', async () => {
                const error = new Error('error');
                service.health.mockRejectedValue(error);

                await controller.health(request, response);

                expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                expect(response.json).toHaveBeenCalledWith({ error: 'error' });
            });
        });
    });
});
