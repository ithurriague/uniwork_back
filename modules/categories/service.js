export default class Service {
    constructor(
        categoryRepository,
    ) {
        this.categoryRepository = categoryRepository;
    }

    async getByID(id) {
        return this.categoryRepository.getByID(id);
    }

    async getAll() {
        return this.categoryRepository.getAll();
    }
}