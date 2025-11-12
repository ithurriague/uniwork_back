import {HTTP_STATUS} from '../../../../common/http/status.js';

export default class Controller {
    constructor(service) {
        this.service = service;
    }

    ping = async (req, res) => {
        try {
            const pong = await this.service.ping(req.body);
            res.status(HTTP_STATUS.OK).json(pong);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    };

    health = async (req, res) => {
        try {
            const check = await this.service.health(req.body);
            res.status(HTTP_STATUS.OK).json(check);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    };
}