import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';

import { IRoute } from '../../data/schemas/route';
import { IGroupInput, IGroupModel } from '../../data/schemas/group';
import { Database } from '../../data/db/db';
import { GroupsCollection } from '../../data/db/groups_collection';
import { genUUID, genCode } from '../../utils/random';
import { verifyJWT, verifyJWTasAdmin, sha256 } from '../../utils/security';
import { AuthError, NotFoundError } from '../../utils/errors';

export class GroupsAPI implements IRoute {
  private collection: GroupsCollection;

  constructor(database: Database) {
    this.collection = database.getGroupsCollection();
  }

  routeReg: FastifyPluginCallback = (instance, opts, next) => {
    // I can't use class' methods because methods can't understand
    // "this" keyword when they called
    instance.post('/', opts, async (req, res) => {
      await this.createNewGroup(req, res);
    });
    instance.post('/:inviteCode', opts, async (req, res) => {
      await this.loginViaInviteCode(req, res);
    });
    instance.get('/my', opts, async (req, res) => {
      await this.getCurrentGroupInfo(req, res);
    });
    instance.delete('/my', opts, async (req, res) => {
      await this.deleteCurrentGroup(req, res);
    });
    instance.get('/my/users', opts, async (req, res) => {
      await this.getCurrentGroupUsers(req, res);
    });
    instance.get('/my/users/:userId', async (req, res) => {
      await this.getUserInfo(req, res);
    });
    instance.delete('/my/users/:userId', async (req, res) => {
      await this.kickUser(req, res);
    });
    instance.get('/my/users/me', opts, async (req, res) => {
      await this.getCurrentUserInfo(req, res);
    });
    instance.delete('/my/users/me', opts, async (req, res) => {
      await this.leaveGroup(req, res);
    });

    next();
  };

  /// POST /groups/
  private async createNewGroup(req: FastifyRequest, res: FastifyReply) {
    const groupId = genUUID();
    const inviteCode = genCode();
    const data = req.body as IGroupInput;

    await this.collection.insertGroup({
      id: groupId,
      name: data.name,
      passcode: sha256(data.passcode!),
      inviteCode: inviteCode,
      users: [],
      structures: [],
    });

    res.send({ id: groupId, inviteCode: inviteCode });
  }

  /// POST /groups/:inviteCode
  private async loginViaInviteCode(req: FastifyRequest, res: FastifyReply) {
    const params = req.params as { inviteCode: string };
    const group: IGroupModel | null =
      await this.collection.getGroupByInviteCode(params.inviteCode);

    if (group) {
      const data = req.body as IGroupInput;
      // Verifying admin passcode, if it passed
      let isAdmin = false;
      console.log(data, data.passcode);
      if (data.passcode) {
        if (sha256(data.passcode) == group.passcode) {
          isAdmin = true;
        } else {
          throw new AuthError('Invalid passcode');
        }
      }

      const userId = genUUID();
      await this.collection.insertUserToGroup(group.id, {
        id: userId,
        name: data.name,
        isAdmin: isAdmin,
        location: {
          isHidden: true,
          position: {
            lat: 0,
            lon: 0,
          },
        },
      });

      const token = await res.jwtSign({ g: group.id, u: userId });
      res.send({ id: userId, token: token });
    } else {
      throw new NotFoundError('No such group found');
    }
  }

  /// GET /groups/my
  private async getCurrentGroupInfo(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.collection, async (jwt, user) => {
      const group = await this.collection.getGroupById(jwt.g);
      delete group!._id;
      delete group!.passcode;
      delete group!.users;
      delete group!.structures;
      res.send(group as IGroupModel);
    });
  }

  /// GET /groups/my/users
  private async getCurrentGroupUsers(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.collection, async (jwt, user) => {
      const group = await this.collection.getGroupById(jwt.g);
      res.send(group!.users);
    });
  }

  /// DELETE /groups/my
  private async deleteCurrentGroup(req: FastifyRequest, res: FastifyReply) {
    await verifyJWTasAdmin(req, this.collection, async (jwt, user) => {
      if (await this.collection.deleteGroupById(jwt.g)) {
        res.send({});
      } else {
        throw new NotFoundError('No such group found');
      }
    });
  }

  /// GET /groups/my/users/:userId
  private async getUserInfo(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.collection, async (jwt, user) => {
      const params = req.params as { userId: string };
      const requestedUser = await this.collection.getOneUser(
        jwt.g,
        params.userId
      );
      if (requestedUser) {
        res.send(requestedUser);
      } else {
        throw new NotFoundError('No such user found');
      }
    });
  }

  /// DELETE /groups/my/users/:userId
  private async kickUser(req: FastifyRequest, res: FastifyReply) {
    await verifyJWTasAdmin(req, this.collection, async (jwt, user) => {
      const params = req.params as { userId: string };
      if (await this.collection.deleteOneUser(jwt.g, params.userId)) {
        res.send({});
      } else {
        throw new NotFoundError('No such user found');
      }
    });
  }

  /// GET /groups/my/users/me
  private async getCurrentUserInfo(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.collection, async (jwt, user) => {
      const requestedUser = await this.collection.getOneUser(
        jwt.g,
        jwt.u
      );
      res.send(requestedUser);
    });
  }

  /// DELETE /groups/my/users/me
  private async leaveGroup(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, this.collection, async (jwt, user) => {
      if (await this.collection.deleteOneUser(jwt.g, jwt.u)) {
        res.send({});
      } else {
        throw new NotFoundError('No such user found');
      }
    });
  }
}
