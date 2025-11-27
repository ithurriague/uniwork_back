import {HTTP_STATUS} from '../../../../common/http/status.js';

export default class Controller {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res) => {
        const {query} = req.validated;
        const result = await this.service.getAll({
            limit: query.limit,
            offset: query.offset
        });
        res.status(HTTP_STATUS.OK).json(result);
    };

    getByID = async (req, res) => {
        const {params} = req.validated;
        const result = await this.service.getByID(params.id);
        res.status(HTTP_STATUS.OK).json(result);
    };

    create = async (req, res) => {
        const application = {
            usersID: null,
            positionsID: null,
            status: null,
        };

        const {body} = req.validated;

        application.usersID = req.user.id;
        application.positionsID = body.positions_id;

        await this.service.create(application);
        return res.status(HTTP_STATUS.CREATED).end();
    };

    update = async (req, res) => {
        const application = {
            usersID: null,
            positionsID: null,
            status: null,
        };

        const {body} = req.validated;

        application.usersID = req.user.id;
        application.positionsID = body.positions_id;
        application.status = body.status;

        await this.service.update(application);
        return res.status(HTTP_STATUS.NO_CONTENT).end();
    };

    deleteByID = async (req, res) => {
        const {params} = req.validated;
        await this.service.deleteByID(params.id, req.user.id);
        res.status(HTTP_STATUS.NO_CONTENT).end();
    };
}
