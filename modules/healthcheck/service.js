export default class Service {
    constructor(repository) {
        this.repository = repository;
    }

    async ping() {
        return {
            status: 'ok'
        };
    }

    async health() {
        return {
            status: 'ok',
            server: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
                timestamp: new Date().toISOString(),
            },
            database: await this.repository.health(),
        };
    }
}