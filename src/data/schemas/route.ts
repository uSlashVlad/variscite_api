import { FastifyPluginCallback } from 'fastify';

export interface IRoute {
  routeReg: FastifyPluginCallback;
}
