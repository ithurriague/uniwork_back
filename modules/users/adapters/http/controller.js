import {HTTP_STATUS} from '../../../../common/http/status.js';

export default class Controller {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res) => {
        try {
            const {query} = req.validated;
            const result = await this.service.getAll({user_type: query.user_type});
            res.status(HTTP_STATUS.OK).json(result);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
    };

    getByID = async (req, res) => {
        try {
            const {params, query} = req.validated;
            const result = await this.service.getByID(params.id, query.user_type);
            res.status(HTTP_STATUS.OK).json(result);
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: err.message});
        }
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


        try {
            const {body} = req.validated;

            // Request body
            user.type = body.user_type;
            user.university = body.university;
            user.degree = body.degree;

            // Token
            user.uid = req.user.uid;
            user.email = req.user.email;
            user.name = req.user.name;
            user.phone = req.user.phone;
            user.pictureURL = req.user.picture;

            const result = await this.service.create(user);
            if (result.error) {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(result);
            } else {
                res.status(HTTP_STATUS.OK).end();
            }
        } catch (err) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: err.message});
        }

    };
}
