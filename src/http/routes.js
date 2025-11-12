import express from 'express';

import HealthcheckRoutes from '../../modules/healthcheck/adapters/http/routes.js';

const server = express();
server.use(express.json());

server.use('', HealthcheckRoutes);

export default server;
