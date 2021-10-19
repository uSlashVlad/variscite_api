import { FastifyPluginCallback } from 'fastify';

import { IRoute } from '../../data/schemas/route';
import { StatusAPI } from './status';
import { GroupsAPI } from './groups';
import { StructuresAPI } from './structures';
import { LocationAPI } from './location';
import { Database } from '../../data/db/db';

export class APIv0 implements IRoute {
  private statusAPI;
  private groupsAPI;
  private structAPI;
  private locationAPI;

  private db: Database;

  constructor(database: Database) {
    this.db = database;

    this.statusAPI = new StatusAPI();
    this.groupsAPI = new GroupsAPI(this.db);
    this.structAPI = new StructuresAPI(this.db);
    this.locationAPI = new LocationAPI(this.db);
  }

  routeReg: FastifyPluginCallback = (instance, opts, next) => {
    instance.register(this.statusAPI.routeReg, { ...opts, prefix: 'status' });
    instance.register(this.groupsAPI.routeReg, { ...opts, prefix: 'groups' });
    instance.register(this.structAPI.routeReg, {
      ...opts,
      prefix: 'structures',
    });
    instance.register(this.locationAPI.routeReg, {
      ...opts,
      prefix: 'location',
    });

    next();
  };
}
