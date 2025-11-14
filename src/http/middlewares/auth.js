import {ERROR} from '../../../common/auth/errors.js';
import firebase from '../../../common/auth/firebase.js';
import {HTTP_STATUS} from '../../../common/http/status.js';
import log from '../../../common/log/pino.js';

export default async function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({error: ERROR.MISSING_BEARER_TOKEN});
    }

    const token = header.split(' ')[1];
    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({error: ERROR.MISSING_BEARER_TOKEN});
    }

    try {
        req.user = await firebase().auth().verifyIdToken(token);
        return next();
    } catch (err) {
        log.error(err, ERROR.INVALID_OR_EXPIRED_BEARER_TOKEN);
        return res.status(HTTP_STATUS.FORBIDDEN).json({error: ERROR.INVALID_OR_EXPIRED_BEARER_TOKEN});
    }
}