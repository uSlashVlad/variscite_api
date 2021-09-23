import { createHash } from 'crypto';
// import { IGroupModel } from 'data/schemas/group';

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex');
}

// TODO rework in future
/// Goes through all user list and returns true, if specified user was found
// export function checkUserInGroup(group: IGroupModel, userId: string): boolean {
//   group.users.forEach((user) => {
//     if (user.id == userId) return true;
//   });
//   return false;
// }
