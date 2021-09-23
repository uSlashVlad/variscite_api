import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';

import { IRoute } from '../../data/schemas/route';
import { IGroupInput, IGroupModel, IUserJWT } from '../../data/schemas/group';
import { Database, GroupsCollection } from '../../data/db';
import { genUUID, genCode } from '../../utils/random';
import { sha256 } from '../../utils/security';
import { AuthError, NotFoundError } from '../../utils/errors';

export class GroupsAPI implements IRoute {
  private groupsCollection: GroupsCollection;

  constructor(database: Database) {
    this.groupsCollection = database.getGroupsCollection();
  }

  routeReg: FastifyPluginCallback = (instance, opts, next) => {
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

    next();
  };

  /// POST /groups/
  private async createNewGroup(req: FastifyRequest, res: FastifyReply) {
    const groupId = genUUID();
    const inviteCode = genCode();
    const data = req.body as IGroupInput;

    await this.groupsCollection.insertGroup({
      id: groupId,
      name: data.name,
      passcode: sha256(data.passcode!),
      inviteCode: inviteCode,
      users: [],
    });

    res.send({ inviteCode: inviteCode });
  }

  /// POST /groups/:inviteCode
  private async loginViaInviteCode(req: FastifyRequest, res: FastifyReply) {
    const params = req.params as { inviteCode: string };
    const group: IGroupModel | null =
      await this.groupsCollection.getGroupByInviteCode(params.inviteCode);

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
      await this.groupsCollection.insertUserToGroup(group.id, {
        id: userId,
        name: data.name,
        isAdmin: isAdmin,
      });

      const token = await res.jwtSign({ g: group.id, u: userId, a: isAdmin });
      res.send({ token: token });
    } else {
      throw new NotFoundError('No such group found');
    }
  }

  /// GET /groups/my
  private async getCurrentGroupInfo(req: FastifyRequest, res: FastifyReply) {
    const decoded = await req.jwtVerify();
    if (decoded) {
      const jwt = decoded as IUserJWT;
      const group = await this.groupsCollection.getGroupById(jwt.g);
      if (group) {
        delete group._id;
        delete group.passcode;
        res.send(group as IGroupModel);
      } else {
        throw new NotFoundError('No such group found or user was kicked');
      }
    } else {
      throw new AuthError('Invalid token');
    }
  }

  /// DELETE /groups/my
  private async deleteCurrentGroup(req: FastifyRequest, res: FastifyReply) {
    const decoded = await req.jwtVerify();
    if (decoded) {
      const jwt = decoded as IUserJWT;
      if (jwt.a) {
        await this.groupsCollection.deleteGroupById(jwt.g);
        res.send({});
      } else {
        throw new AuthError('Insufficient permissions');
      }
    } else {
      throw new AuthError('Invalid token');
    }
  }
}
