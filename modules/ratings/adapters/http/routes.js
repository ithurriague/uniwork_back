import {Router} from 'express';

import {
    CreateRatingsSchema,
    GetRatingsByIDSchema,
    GetRatingsSchema
} from './schemas.js';
import {PERMISSIONS} from '../../../../common/auth/permissions.js';
import authenticate from '../../../../src/http/middlewares/authenticate.js';
import validate from '../../../../src/http/middlewares/validate.js';

export default function register(container) {
    const router = Router();

    router.get(
        '/ratings',
        validate(GetRatingsSchema),
        container.RatingController.getAll,
    );
    router.get(
        '/ratings/:id',
        validate(GetRatingsByIDSchema),
        container.RatingController.getByID,
    );
    router.post(
        '/ratings',
        validate(CreateRatingsSchema),
        authenticate,
        container.AuthorizeMiddleware.requires(PERMISSIONS.RATINGS_CREATE),
        container.RatingController.create,
    );

    return router;
}

