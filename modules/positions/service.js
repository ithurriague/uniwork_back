import {ForbiddenError} from '../../common/http/errors.js';

export default class Service {
    constructor(
        positionRepository,
        categoryService,
    ) {
        this.positionRepository = positionRepository;
        this.categoryService = categoryService;
    }

    async getAll(filter) {
        return this.positionRepository.getAll(filter);
    }

    async getByID(id) {
        return this.positionRepository.getByID(id);
    }

    async create(position) {
        await this.categoryService.getByID(position.categoriesID);
        await this.positionRepository.create(position);
    }

    async deleteByID(id, userID) {
        const {position} = await this.positionRepository.getByID(id);
        if (position.users_id !== userID) {
            throw new ForbiddenError(`user id ${userID} does not own the position`);
        }

        return this.positionRepository.deleteByID(id, userID);
    }
}
