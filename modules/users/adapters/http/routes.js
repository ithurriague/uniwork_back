import {Router} from 'express';

import authenticate from '../../../../src/http/middlewares/authenticate.js';
import validate from '../../../../src/http/middlewares/validate.js';
import {CreateUserSchema, GetUserByIDSchema, GetUsersSchema} from '../../schemas.js';

export default function register(container) {
    const router = Router();

    router.post('/users', authenticate, validate(CreateUserSchema), container.UserController.create);
    router.get('/users', validate(GetUsersSchema), container.UserController.getAll);
    router.get('/users/{id}', validate(GetUserByIDSchema), container.UserController.getByID);

    return router;
}

