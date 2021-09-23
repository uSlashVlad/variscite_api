import { FastifyPluginCallback } from 'fastify';

import { IRoute } from '../../data/schemas/route';
import { StatusAPI } from './status';
import { GroupsAPI } from './groups';
import { Database } from '../../data/db';

export class APIv0 implements IRoute {
  private statusAPI;
  private groupsAPI;

  private db: Database;

  constructor(database: Database) {
    this.db = database;

    this.statusAPI = new StatusAPI();
    this.groupsAPI = new GroupsAPI(this.db);
  }

  routeReg: FastifyPluginCallback = (instance, opts, next) => {
    instance.register(this.statusAPI.routeReg, { ...opts, prefix: 'status' });
    instance.register(this.groupsAPI.routeReg, { ...opts, prefix: 'groups' })

    next();
  };
}
