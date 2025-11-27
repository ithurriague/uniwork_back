import {HTTP_STATUS} from '../../../../common/http/status.js';

export default class Controller {
    constructor(service) {
        this.service = service;
    }

    getAll = async (req, res) => {
        const {query} = req.validated;
        const result = await this.service.getAll({
            limit: query.limit,
            offset: query.offset,
            applicationsID: query.applications_id
        });
        res.status(HTTP_STATUS.OK).json(result);
    };

    getByID = async (req, res) => {
        const {params} = req.validated;
        const result = await this.service.getByID(params.id);
        res.status(HTTP_STATUS.OK).json(result);
    };

    create = async (req, res) => {
        const rating = {
            raterID: null,
            raterType: null,
            rateeID: null,
            rateeType: null,
            applicationsID: null,
            stars: null,
            review: null,
        };

        const {body} = req.validated;

        rating.raterID = req.user.id;
        rating.raterType = req.user.user_type;
        rating.rateeID = body.ratee_id;
        rating.applicationsID = body.applications_id;
        rating.stars = body.stars;
        rating.review = body.review;

        await this.service.create(rating);
        return res.status(HTTP_STATUS.CREATED).end();
    };
}
