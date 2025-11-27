import {HTTP_STATUS} from '../../../../common/http/status.js';

export default class Controller {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res) => {
        const {query} = req.validated;
        const result = await this.service.getAll({
            user_type: query.user_type,
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
        const user = {
            rolesID: null,
            type: null,
            uid: null,
            email: null,
            name: null,
            phone: null,
            pictureURL: null,
            university: null,
            degree: null,
        };


        const {body} = req.validated;

        // Request body
        user.type = body.user_type;
        user.university = body.university;
        user.degree = body.degree;

        // Token
        user.uid = req.token.uid;
        user.email = req.token.email;
        user.name = req.token.name;
        user.phone = req.token.phone;
        user.pictureURL = req.token.picture;

        const result = await this.service.create(user);
        if (result.error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(result);
        } else {
            res.status(HTTP_STATUS.OK).end();
        }
    };
}
