import { MongoClient, Collection, Document } from 'mongodb';
import { IGroupModel, IUserModel, IUserJWT } from 'data/schemas/group';

export class Database {
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.genUrl());
  }

  private genUrl(): string {
    const protocol = process.env.MONGODB_PROTOCOL;
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const address = process.env.MONGODB_ADDRESS;
    const database = process.env.MONGODB_DATABASE;
    return (
      `${protocol}://${user}:${password}@${address}/${database}` +
      '?authSource=admin&retryWrites=true&w=majority'
    );
  }

  async initDB(): Promise<void> {
    await this.client.connect();

    console.log('Welcome to MongoDB!');
  }

  getGroupsCollection(): GroupsCollection {
    let db = this.client.db();
    return new GroupsCollection(db.collection('groups'));
  }
}

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

  async deleteGroupById(id: string): Promise<void> {
    await this.collection.deleteOne({ id: id });
  }

  async getUserFromGroup(
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

  async deleteUserFromGroup(groupId: string, userId: string): Promise<void> {
    await this.collection.updateOne(
      { id: groupId },
      { $pull: { users: { id: userId } } }
    );
  }
}

interface GroupDocument extends Document, IGroupModel {}
