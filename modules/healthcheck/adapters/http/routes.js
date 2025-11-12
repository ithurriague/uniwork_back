import {Router} from 'express';

import Controller from './controller.js';
import db from '../../../../common/database/postgresql.js';
import Repository from '../../repository.js';
import Service from '../../service.js';

const router = Router();

const repository = new Repository(db);
const service = new Service(repository);
const controller = new Controller(service);

router.get('/ping', controller.ping);
router.get('/health', controller.health);

export default router;