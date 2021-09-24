import { createHash } from 'crypto';
import { IUserModel } from 'data/schemas/group';
// import { IGroupModel } from 'data/schemas/group';

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
