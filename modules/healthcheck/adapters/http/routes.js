import {Router} from 'express';

export default function register(container) {
    const router = Router();

    router.get('/ping', container.HealthcheckController.ping);
    router.get('/health', container.HealthcheckController.health);

    return router;
}