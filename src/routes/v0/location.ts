import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';

import { IRoute } from '../../data/schemas/route';
import { Database } from 'data/db/db';
import { LocationsCollection } from 'data/db/locations_collection';
import { GroupsCollection } from 'data/db/groups_collection';
import { verifyJWT } from '../../utils/security';
import { NotFoundError } from '../../utils/errors';
import {
  convertPosition,
  IGeoPositionInput,
} from '../../data/schemas/location';

export class LocationAPI implements IRoute {
  private collection: LocationsCollection;
  private groupCollection: GroupsCollection;

  constructor(database: Database) {
    this.collection = database.getLocationCollection();
    this.groupCollection = database.getGroupsCollection();
  }

  routeReg: FastifyPluginCallback = (instance, opts, next) => {
    // I can't use class' methods because methods can't understand
    // "this" keyword when they called
    instance.get('/all', opts, async (req, res) => {
      await this.getAllLocations(req, res);
    });
    instance.get('/:userId', opts, async (req, res) => {
      await this.getUserLocation(req, res);
    });
    instance.put('/my', opts, async (req, res) => {
      await this.updateUserLocation(req, res);
    });
    instance.delete('/my', opts, async (req, res) => {
      await this.eraseUserLocation(req, res);
    });

    next();
  };

  /// GET /location/all
  private async getAllLocations(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const query = req.query as { exclude_user: boolean };
      const location = (await this.collection.getAllUsersLocation(
        jwt.g,
        user.id,
        query.exclude_user
      ))!;
      res.send(location);
    });
  }

  /// GET /location/:userId
  private async getUserLocation(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const params = req.params as { userId: string };
      const location = await this.collection.getUserLocation(
        jwt.g,
        params.userId
      );
      if (location) {
        res.send(location);
      } else {
        throw new NotFoundError('No such user found or location is hidden');
      }
    });
  }

  /// GET /location/my
  private async getCurrentUserLocation(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const location = await this.collection.getUserLocation(jwt.g, user.id);
      if (location) {
        res.send(location);
      } else {
        throw new NotFoundError('No such user found or location is hidden');
      }
    });
  }

  /// PUT /location/my
  private async updateUserLocation(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const body = req.body as IGeoPositionInput;
      const position = convertPosition(body);
      await this.collection.updateUserLocation(jwt.g, jwt.u, position);
      res.send(position);
    });
  }

  /// DELETE /location/my
  private async eraseUserLocation(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      await this.collection.eraseUserLocation(jwt.g, jwt.u);
      res.send({});
    });
  }
}
