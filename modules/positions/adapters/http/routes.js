import {Router} from 'express';

import {
    CreatePositionSchema,
    DeletePositionByIDSchema,
    GetPositionByIDSchema,
    GetPositionsSchema
} from './schemas.js';
import {PERMISSIONS} from '../../../../common/auth/permissions.js';
import authenticate from '../../../../src/http/middlewares/authenticate.js';
import validate from '../../../../src/http/middlewares/validate.js';

export default function register(container) {
    const router = Router();

    router.get(
        '/positions',
        validate(GetPositionsSchema),
        container.PositionController.getAll,
    );
    router.get(
        '/positions/:id',
        validate(GetPositionByIDSchema),
        container.PositionController.getByID,
    );
    router.post(
        '/positions',
        validate(CreatePositionSchema),
        authenticate,
        container.AuthorizeMiddleware.requires(PERMISSIONS.POSITIONS_CREATE),
        container.PositionController.create,
    );
    router.delete('/positions/:id',
        validate(DeletePositionByIDSchema),
        authenticate,
        container.AuthorizeMiddleware.requires(PERMISSIONS.POSITIONS_DELETE),
        container.PositionController.deleteByID,
    );

    return router;
}

