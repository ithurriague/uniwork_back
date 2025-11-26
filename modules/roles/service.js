export default class Service {
    constructor(repository) {
        this.repository = repository;
    }

    async getByID(id) {
        return this.repository.getByID(id);
    }

   async getAll() {
       return this.repository.getAll();
   }
}
