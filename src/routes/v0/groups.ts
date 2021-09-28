import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';

import { IRoute } from '../../data/schemas/route';
import { IGroupInput, IGroupModel, IUserJWT } from '../../data/schemas/group';
import { Database, GroupsCollection } from '../../data/db';
import { genUUID, genCode } from '../../utils/random';
import {
  checkUserInGroup,
  verifyJWT,
  verifyJWTasAdmin,
  sha256,
} from '../../utils/security';
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
      await this.deleteUser(req, res);
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

    res.send({ inviteCode: inviteCode });
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
      });

      const token = await res.jwtSign({ g: group.id, u: userId });
      res.send({ token: token });
    } else {
      throw new NotFoundError('No such group found');
    }
  }

  /// GET /groups/my
  private async getCurrentGroupInfo(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, async (jwt) => {
      const group = await this.collection.getGroupById(jwt.g);
      if (group && checkUserInGroup(group.users ?? [], jwt.u)) {
        delete group._id;
        delete group.passcode;
        delete group.users;
        delete group.structures;
        res.send(group as IGroupModel);
      } else {
        throw new NotFoundError('No such group found or user was kicked');
      }
    });
  }

  /// GET /groups/my/users
  private async getCurrentGroupUsers(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, async (jwt) => {
      const group = await this.collection.getGroupById(jwt.g);
      if (group && checkUserInGroup(group.users ?? [], jwt.u)) {
        res.send(group.users);
      } else {
        throw new NotFoundError('No such group found or user was kicked');
      }
    });
  }

  /// DELETE /groups/my
  private async deleteCurrentGroup(req: FastifyRequest, res: FastifyReply) {
    await verifyJWTasAdmin(req, this.collection, async (jwt) => {
      if (await this.collection.deleteGroupById(jwt.g)) {
        res.send({});
      } else {
        throw new NotFoundError('No such group found');
      }
    });
  }

  /// GET /groups/my/users/:userId
  private async getUserInfo(req: FastifyRequest, res: FastifyReply) {
    await verifyJWT(req, async (jwt) => {
      const params = req.params as { userId: string };
      const user = await this.collection.getOneUser(jwt.g, params.userId);
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('No such group found or user was kicked');
      }
    });
  }

  /// DELETE /groups/my/users/:userId
  private async deleteUser(req: FastifyRequest, res: FastifyReply) {
    await verifyJWTasAdmin(req, this.collection, async (jwt) => {
      const params = req.params as { userId: string };
      if (await this.collection.deleteOneUser(jwt.g, params.userId)) {
        res.send({});
      } else {
        throw new NotFoundError('No such user found');
      }
    });
  }
}
