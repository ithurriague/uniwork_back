import {HTTP_STATUS} from '../../../../common/http/status.js';

export default class Controller {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res) => {
        const result = await this.service.getAll();
        res.status(HTTP_STATUS.OK).json(result);
    };
}
