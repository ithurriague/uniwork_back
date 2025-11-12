const ERROR = {
    SERVER_PORT_MISSING: 'SERVER_PORT env variable is missing',
    PORT_NOT_A_POSITIVE_NUMBER: 'PORT env variable must be a positive number'
};

export default class Config {
    static port() {
        const port = Number(process.env.SERVER_PORT);
        if (isNaN(port)) {
            throw new Error(ERROR.SERVER_PORT_MISSING);
        }

        if (port <= 0) {
            throw new Error(ERROR.PORT_NOT_A_POSITIVE_NUMBER);
        }

        return port;
    }
}