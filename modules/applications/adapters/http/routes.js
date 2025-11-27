import {Router} from 'express';

import {
    CreateApplicationsSchema,
    DeleteApplicationsByIDSchema,
    GetApplicationsByIDSchema,
    GetApplicationsSchema,
    UpdateApplicationsSchema,
} from './schemas.js';
import {PERMISSIONS} from '../../../../common/auth/permissions.js';
import authenticate from '../../../../src/http/middlewares/authenticate.js';
import validate from '../../../../src/http/middlewares/validate.js';

export default function register(container) {
    const router = Router();

    router.get(
        '/applications',
        validate(GetApplicationsSchema),
        container.ApplicationController.getAll,
    );
    router.get(
        '/applications/:id',
        validate(GetApplicationsByIDSchema),
        container.ApplicationController.getByID,
    );
    router.post(
        '/applications',
        validate(CreateApplicationsSchema),
        authenticate,
        container.AuthorizeMiddleware.requires(PERMISSIONS.APPLICATIONS_CREATE),
        container.ApplicationController.create,
    );
    router.patch(
        '/applications',
        validate(UpdateApplicationsSchema),
        authenticate,
        container.AuthorizeMiddleware.requires(PERMISSIONS.APPLICATIONS_UPDATE),
        container.ApplicationController.update,
    );
    router.delete('/applications/:id',
        validate(DeleteApplicationsByIDSchema),
        authenticate,
        container.AuthorizeMiddleware.requires(PERMISSIONS.APPLICATIONS_DELETE),
        container.ApplicationController.deleteByID,
    );

    return router;
}

