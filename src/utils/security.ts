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

export async function isUserAdmin(
  collection: GroupsCollection,
  groupId: string,
  userId: string
): Promise<boolean> {
  const user = await collection.getOneUser(groupId, userId);
  if (user) {
    return user.isAdmin;
  } else return false;
}

export async function verifyJWT(
  req: FastifyRequest,
  callback: (jwt: IUserJWT) => Promise<void>
) {
  await req
    .jwtVerify()
    .catch((reason) => {
      throw new AuthError(reason);
    })
    .then(async (decoded) => {
      await callback(decoded as IUserJWT);
    });
}

export async function verifyJWTasAdmin(
  req: FastifyRequest,
  collection: GroupsCollection,
  callback: (jwt: IUserJWT) => Promise<void>
) {
  await verifyJWT(req, async (jwt) => {
    if (await isUserAdmin(collection, jwt.g, jwt.u)) {
      await callback(jwt);
    } else {
      throw new NoPermissionsError('Insufficient permissions');
    }
  });
}
