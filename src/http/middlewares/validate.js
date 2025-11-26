import {ZodError} from 'zod';

import {HTTP_STATUS} from '../../../common/http/status.js';

export default function validate(...schemas) {
    return (req, res, next) => {
        try {
            const result = {body: {}, query: {}, params: {}};

            schemas.forEach((schema) => {
                if (schema.body) {
                    const parsed = schema.body.parse(req.body);
                    Object.assign(result.body, parsed);
                }
                if (schema.query) {
                    const parsed = schema.query.parse(req.query);
                    Object.assign(result.query, parsed);
                }
                if (schema.params) {
                    const parsed = schema.params.parse(req.params);
                    Object.assign(result.params, parsed);
                }
            });

            req.validated = result;
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({causes: error.issues});
            }
            return next(error);
        }
    };
}
