import { Collection } from 'mongodb';
import { GroupDocument } from './db';

import { IGroupModel, IUserModel } from '../schemas/group';

export class GroupsCollection {
  protected collection: Collection<GroupDocument>;

  constructor(collection: Collection<GroupDocument>) {
    this.collection = collection;
  }

  async insertGroup(group: IGroupModel): Promise<void> {
    await this.collection.insertOne(group);
  }

  getGroupByInviteCode(inviteCode: string): Promise<GroupDocument | null> {
    return this.collection.findOne({ inviteCode: inviteCode });
  }

  getGroupById(id: string): Promise<GroupDocument | null> {
    return this.collection.findOne({ id: id });
  }

  async insertUserToGroup(groupId: string, user: IUserModel): Promise<void> {
    await this.collection.updateOne(
      { id: groupId },
      { $push: { users: user } }
    );
  }

  async deleteGroupById(id: string): Promise<boolean> {
    const res = await this.collection.deleteOne({ id: id });
    return res.deletedCount > 0;
  }

  async getOneUser(
    groupId: string,
    userId: string
  ): Promise<IUserModel | null> {
    // A bit complicated aggregation,
    // gets specific user from users list from group
    return (await this.collection
      .aggregate([
        // select only the desired group
        { $match: { id: groupId } },
        // leave only the desired user
        {
          $addFields: {
            users: {
              $filter: {
                input: '$users',
                cond: {
                  $eq: ['$$this.id', userId],
                },
              },
            },
          },
        },
        // replace list with the only user on that user object
        { $unwind: '$users' },
        // replace root object with the desired user
        { $replaceWith: '$users' },
      ])
      .next()) as unknown as IUserModel | null;
  }

  async deleteOneUser(groupId: string, userId: string): Promise<boolean> {
    const res = await this.collection.updateOne(
      { id: groupId },
      { $pull: { users: { id: userId } } }
    );
    return res.modifiedCount > 0;
  }
}
