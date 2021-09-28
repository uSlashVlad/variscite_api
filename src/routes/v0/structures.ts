import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';

import { IRoute } from 'data/schemas/route';
import { IGroupInput, IGroupModel, IUserJWT } from 'data/schemas/group';
import { IGeoStruct } from 'data/schemas/structures';
import { Database, StructureCollection } from 'data/db';
import { NoPermissionsError, NotFoundError } from '../../utils/errors';
import { genUUID } from '../../utils/random';
import { isUserAdmin, verifyJWT } from '../../utils/security';

export class StructuresAPI implements IRoute {
  private collection: StructureCollection;

  constructor(database: Database) {
    this.collection = database.getStructuresCollection();
  }

  routeReg: FastifyPluginCallback = (instance, opts, next) => {
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

    next();
  };

  /// GET /structures
  private async getListOfStructs(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, async (jwt) => {
      const group = await this.collection
        .asGroupCollection()
        .getGroupById(jwt.g);
      if (group) {
        res.send(group.structures);
      } else {
        throw new NotFoundError('No such group found or user was kicked');
      }
    });
  }

  /// POST /structures
  private async postNewStruct(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, async (jwt) => {
      const struct: IGeoStruct = {
        id: genUUID(),
        user: jwt.u,
        struct: req.body as object,
      };
      this.collection.insertStructure(jwt.g, struct);
      res.send(struct);
    });
  }

  /// GET /structures/:structId
  private async getStructInfo(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, async (jwt) => {
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
    await verifyJWT(req, async (jwt) => {
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
    await verifyJWT(req, async (jwt) => {
      const params = req.params as { structId: string };

      // This needs to be checked because only admin and structure' creator
      // can delete structure, so I check admin rights and check user' id
      let userHavePermissions = false;
      if (
        await isUserAdmin(this.collection.asGroupCollection(), jwt.g, jwt.u)
      ) {
        userHavePermissions = true;
      } else {
        const struct = await this.collection.getOneStructure(
          jwt.g,
          params.structId
        );
        if (struct) {
          if (struct.user == jwt.u) {
            userHavePermissions = true;
          }
        } else {
          throw new NotFoundError('No such structure found');
        }
      }

      if (userHavePermissions) {
        await this.collection.deleteOneStructure(jwt.g, params.structId);
        res.send({});
      } else {
        throw new NoPermissionsError('Insufficient permissions');
      }
    });
  }
}
