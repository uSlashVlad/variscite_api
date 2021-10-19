import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';

import { IRoute } from 'data/schemas/route';
import { IUserJWT, IUserModel } from 'data/schemas/group';
import { IGeoStruct } from 'data/schemas/structure';
import { Database } from 'data/db/db';
import { StructuresCollection } from 'data/db/structures_collection';
import { GroupsCollection } from 'data/db/groups_collection';
import { NoPermissionsError, NotFoundError } from '../../utils/errors';
import { genUUID } from '../../utils/random';
import { verifyJWT } from '../../utils/security';

export class StructuresAPI implements IRoute {
  private collection: StructuresCollection;
  private groupCollection: GroupsCollection;

  constructor(database: Database) {
    this.collection = database.getStructuresCollection();
    this.groupCollection = database.getGroupsCollection();
  }

  routeReg: FastifyPluginCallback = (instance, opts, next) => {
    // I can't use class' methods because methods can't understand
    // "this" keyword when they called
    instance.get('/', opts, async (req, res) => {
      await this.getListOfStructs(req, res);
    });
    instance.post('/', opts, async (req, res) => {
      await this.postNewStruct(req, res);
    });
    instance.get('/:structId', opts, async (req, res) => {
      await this.getStructInfo(req, res);
    });
    instance.put('/:structId', opts, async (req, res) => {
      await this.editStruct(req, res);
    });
    instance.delete('/:structId', opts, async (req, res) => {
      await this.deleteStruct(req, res);
    });
    instance.get('/:structId/fields', opts, async (req, res) => {
      await this.getFields(req, res);
    });
    instance.post('/:structId/fields', opts, async (req, res) => {
      await this.addFields(req, res);
    });
    instance.delete('/:structId/fields', opts, async (req, res) => {
      await this.removeFields(req, res);
    });

    next();
  };

  /// GET /structures
  private async getListOfStructs(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const group = await this.groupCollection.getGroupById(jwt.g);
      if (group) {
        res.send(group.structures);
      } else {
        throw new NotFoundError('No such group found or user was kicked');
      }
    });
  }

  /// POST /structures
  private async postNewStruct(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const struct: IGeoStruct = {
        id: genUUID(),
        user: jwt.u,
        struct: req.body as object,
        fields: {},
      };
      this.collection.insertStructure(jwt.g, struct);
      res.send(struct);
    });
  }

  /// GET /structures/:structId
  private async getStructInfo(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const params = req.params as { structId: string };
      const struct = await this.collection.getOneStructure(
        jwt.g,
        params.structId
      );
      if (struct) {
        res.send(struct);
      } else {
        throw new NotFoundError('No such structure found');
      }
    });
  }

  /// PUT /structures/:structId
  private async editStruct(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const params = req.params as { structId: string };
      // This checks author of structure, because only author can edit it
      const struct = await this.collection.getOneStructure(
        jwt.g,
        params.structId
      );
      if (struct) {
        if (struct.user == jwt.u) {
          await this.collection.replaceObjectInStructure(
            jwt.g,
            params.structId,
            req.body as object
          );
          struct.struct = req.body as object;
          res.send(struct);
        } else {
          throw new NoPermissionsError('Insufficient permissions');
        }
      } else {
        throw new NotFoundError('No such structure found');
      }
    });
  }

  /// DELETE /structures/:structId
  private async deleteStruct(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const params = req.params as { structId: string };

      if (
        await this.isUserHasPermissionToEditStructure(
          jwt,
          user,
          params.structId
        )
      ) {
        await this.collection.deleteOneStructure(jwt.g, params.structId);
        res.send({});
      } else {
        throw new NoPermissionsError('Insufficient permissions');
      }
    });
  }

  /// GET /structures/:structId/fields
  private async getFields(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const params = req.params as { structId: string };

      if (
        await this.isUserHasPermissionToEditStructure(
          jwt,
          user,
          params.structId
        )
      ) {
        const fields = await this.collection.getFields(jwt.g, params.structId);
        if (fields) {
          res.send(fields);
        } else {
          throw new NotFoundError('No such structure found');
        }
      } else {
        throw new NoPermissionsError('Insufficient permissions');
      }
    });
  }

  /// POST /structures/:structId/fields
  private async addFields(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const params = req.params as { structId: string };

      if (
        await this.isUserHasPermissionToEditStructure(
          jwt,
          user,
          params.structId
        )
      ) {
        const fields = req.body as object;
        if (
          await this.collection.updateFields(
            jwt.g,
            params.structId,
            new Map(Object.entries(fields))
          )
        ) {
          res.send(await this.collection.getFields(jwt.g, params.structId));
        } else {
          throw new NotFoundError('No such structure found');
        }
      } else {
        throw new NoPermissionsError('Insufficient permissions');
      }
    });
  }

  /// DELETE /structures/:structId/fields
  private async removeFields(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.groupCollection, async (jwt, user) => {
      const params = req.params as { structId: string };

      if (
        await this.isUserHasPermissionToEditStructure(
          jwt,
          user,
          params.structId
        )
      ) {
        const query = req.query as { fields: string };
        const fields = query.fields.split(',');
        for (let i = 0; i < fields.length; i++) {
          fields[i] = fields[i].trim();
        }

        if (
          await this.collection.removeFields(jwt.g, params.structId, fields)
        ) {
          res.send(await this.collection.getFields(jwt.g, params.structId));
        } else {
          throw new NotFoundError('No such structure or fields found');
        }
      } else {
        throw new NoPermissionsError('Insufficient permissions');
      }
    });
  }

  private async isUserHasPermissionToEditStructure(
    jwt: IUserJWT,
    user: IUserModel,
    structId: string
  ) {
    // This needs to be checked because only admin and structure' creator
    // can delete structure, so I check admin rights and check user' id
    let userHavePermissions = false;

    if (user.isAdmin) {
      userHavePermissions = true;
    } else {
      const struct = await this.collection.getOneStructure(jwt.g, structId);
      if (struct) {
        if (struct.user == jwt.u) {
          userHavePermissions = true;
        }
      } else {
        throw new NotFoundError('No such structure found');
      }
    }

    return userHavePermissions;
  }
}
