import pino from 'pino';

import Config from '../../config/config.js';

/** @type {import('pino').Logger} */
const logger = pino({
    level: Config.logLevel(),
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
});

export default logger;
