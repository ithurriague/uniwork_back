import {ERROR} from '../../../common/auth/errors.js';
import firebase from '../../../common/auth/firebase.js';
import {ForbiddenError, UnauthorizedError} from '../../../common/http/errors.js';
import log from '../../../common/log/pino.js';

export default async function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return next(new UnauthorizedError(ERROR.MISSING_BEARER_TOKEN));
    }

    const token = header.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError(ERROR.MISSING_BEARER_TOKEN));
    }

    try {
        req.token = await firebase().auth().verifyIdToken(token);
        return next();
    } catch (err) {
        log.error(err, ERROR.INVALID_OR_EXPIRED_BEARER_TOKEN);
        return next(new ForbiddenError(ERROR.INVALID_OR_EXPIRED_BEARER_TOKEN));
    }
}