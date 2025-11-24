import {Router} from 'express';

import Controller from './controller.js';
import getPool from '../../../../common/db/postgresql.js';
import Repository from '../../repository.js';
import Service from '../../service.js';

const router = Router();

const repository = new Repository(getPool());
const service = new Service(repository);
const controller = new Controller(service);

router.get('/ping', controller.ping);
router.get('/health', controller.health);

export default router;