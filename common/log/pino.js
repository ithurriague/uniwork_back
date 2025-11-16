import pino from 'pino';

import Config from '../../config/config.js';

const logger = pino({
    level: Config.logLevel(),
    timestamp: pino.stdTimeFunctions.isoTime,
    base: undefined,
});

export default logger;
