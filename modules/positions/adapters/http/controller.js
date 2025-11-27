import {HTTP_STATUS} from '../../../../common/http/status.js';

export default class Controller {
    constructor(
        service,
    ) {
        this.service = service;
    }

    getAll = async (req, res) => {
        const {query} = req.validated;
        const result = await this.service.getAll({limit: query.limit, offset: query.offset});
        res.status(HTTP_STATUS.OK).json(result);
    };

    getByID = async (req, res) => {
        const {params} = req.validated;
        const result = await this.service.getByID(params.id);
        res.status(HTTP_STATUS.OK).json(result);
    };

    create = async (req, res) => {
        const position = {
            usersID: null,
            categoriesID: null,
            name: null,
            description: null,
            pay: null,
            location: null,
            is_remote: null,
            skills: null,
        };


        const {body} = req.validated;

        position.usersID = req.user.id;
        position.categoriesID = body.categories_id;
        position.name = body.name;
        position.description = body.description;
        position.pay = body.pay;
        position.location = body.location;
        position.is_remote = body.is_remote;
        position.skills = body.skills;

        await this.service.create(position);
        res.status(HTTP_STATUS.OK).end();

    };

    deleteByID = async (req, res) => {
        const {params} = req.validated;
        await this.service.deleteByID(params.id, req.user.id);
        res.status(HTTP_STATUS.NO_CONTENT).end();
    };
}
