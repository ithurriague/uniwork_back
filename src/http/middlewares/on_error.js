import {HttpError} from '../../../common/http/errors.js';
import {HTTP_STATUS} from '../../../common/http/status.js';


export default class Middleware {
    constructor(
        logger,
    ) {
        this.log = logger;
    }

    onError = (err, req, res, _next) => {
        if (err instanceof HttpError) {
            this.log.warn(err, 'HTTP error');

            return res.status(err.status).json({
                error: err.message,
            });
        }

        this.log.error(err, 'Unhandled error');
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: 'Internal Server Error',
        });
    };
}
