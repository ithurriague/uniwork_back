import {ERROR} from './errors.js';

export const ENV = {
    LOCAL: 'local',
    STAGING: 'staging',
    PRODUCTION: 'production',
};

export default class Config {
    static port() {
        const port = Number(process.env.SERVER_PORT);
        if (isNaN(port)) {
            throw new Error(ERROR.MISSING_ENV_SERVER_PORT);
        }

        if (port <= 0) {
            throw new Error(ERROR.PORT_NOT_A_POSITIVE_NUMBER);
        }

        return port;
    }

    static env() {
        const env = process.env.ENV;
        if (!env) {
            throw new Error(ERROR.MISSING_ENV_ENV);
        }

        if (!Object.values(ENV).includes(env)) {
            throw new Error(ERROR.NOT_A_VALID_ENV);
        }

        return env;
    }

    static credentialsPath() {
        const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (!credentials) {
            throw new Error(ERROR.MISSING_ENV_GOOGLE_APPLICATION_CREDENTIALS);
        }

        return credentials;
    }

    static webApiKey() {
        const key = process.env.FIREBASE_WEB_API_KEY;
        if (!key) {
            throw new Error(ERROR.MISSING_ENV_FIREBASE_WEB_API_KEY);
        }

        return key;
    }

    static logLevel() {
        return process.env.LOG_LEVEL || 'info';
    }

    static dbURL() {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error(ERROR.MISSING_ENV_DATABASE_URL);
        }

        return url;
    }
}