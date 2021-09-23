import { FastifyPluginCallback } from 'fastify';

import { IRoute } from 'data/schemas/route';

export class StatusAPI implements IRoute {
  routeReg: FastifyPluginCallback = (instance, opts, next) => {
    instance.get('/', opts, (req, res) => {
      res.send({ text: 'OK!' });
    });

    next();
  };
}
