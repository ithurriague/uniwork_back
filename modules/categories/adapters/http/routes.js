import {Router} from 'express';

export default function register(container) {
    const router = Router();

    router.get('/categories', container.CategoryController.getAll);

    return router;
}

