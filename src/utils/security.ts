import { createHash } from 'crypto';
import { FastifyRequest } from 'fastify';
import { IUserModel, IUserJWT } from 'data/schemas/group';
import { GroupsCollection } from 'data/db';
import { AuthError, NoPermissionsError } from './errors';

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex');
}

/// Goes through all user list and returns true, if specified user was found
export function checkUserInGroup(users: IUserModel[], userId: string): boolean {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == userId) return true;
  }
  return false;
}

export async function verifyJWT(
  req: FastifyRequest,
  collection: GroupsCollection,
  callback: (jwt: IUserJWT, user: IUserModel) => Promise<void>
) {
  await req
    .jwtVerify()
    .catch((reason) => {
      throw new AuthError(reason);
    })
    .then(async (decoded) => {
      const jwt = decoded as IUserJWT;
      const user = await collection.getOneUser(jwt.g, jwt.u);
      if (user) {
        await callback(jwt, user);
      } else {
        throw new AuthError('Invalid or outdated token');
      }
    });
}

export async function verifyJWTasAdmin(
  req: FastifyRequest,
  collection: GroupsCollection,
  callback: (jwt: IUserJWT, user: IUserModel) => Promise<void>
) {
  await verifyJWT(req, collection, async (jwt, user) => {
    if (user.isAdmin) {
      await callback(jwt, user);
    } else {
      throw new NoPermissionsError('Insufficient permissions');
    }
  });
}
