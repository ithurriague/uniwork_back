import {ForbiddenError} from '../../common/http/errors.js';
import {APPLICATION_STATUS} from '../../common/types/application_status.js';

export default class Service {
    constructor(
        applicationRepository,
    ) {
        this.applicationRepository = applicationRepository;
    }

    async getAll(filter) {
        return this.applicationRepository.getAll(filter);
    }

    async getByID(id) {
        return this.applicationRepository.getByID(id);
    }

    async create(application) {
        application.status = APPLICATION_STATUS.PENDING;
        return this.applicationRepository.create(application);
    }

    async update(application) {
        return await this.applicationRepository.update(application);
    }

    async deleteByID(id, userID) {
        const {application} = await this.applicationRepository.getByID(id);
        if (application.users_id !== userID) {
            throw new ForbiddenError(`user id ${userID} does not own the application`);
        }

        return this.applicationRepository.deleteByID(id, userID);
    }
}
