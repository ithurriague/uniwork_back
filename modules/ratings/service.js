import {UnprocessableEntityError} from '../../common/http/errors.js';

export default class Service {
    constructor(
        ratingsRepository,
        userService,
    ) {
        this.ratingsRepository = ratingsRepository;
        this.userService = userService;
    }

    async getAll(filter) {
        return this.ratingsRepository.getAll(filter);
    }

    async getByID(id) {
        return this.ratingsRepository.getByID(id);
    }

    async create(rating) {
        const {user} = await this.userService.getByID(rating.rateeID);
        rating.rateeType = user.user_type;

        if (rating.raterType === rating.rateeType) {
            throw new UnprocessableEntityError('rater_type and ratee_type can not be the same');
        }

        return this.ratingsRepository.create(rating);
    }
}
