export default class TransactionRepository {
    constructor(db) {
        this.db = db;
    }

    async transaction(fn) {
        const client = await this.db.connect();

        try {
            await client.query('BEGIN');
            const result = await fn(client);
            await client.query('COMMIT');
            return result;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}
