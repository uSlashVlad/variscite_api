import { MongoClient, Collection, Document } from 'mongodb';
import { IGroupModel, IUserModel } from 'data/schemas/group';
import { IGeoStruct } from './schemas/structures';

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

  getStructuresCollection(): StructureCollection {
    let db = this.client.db();
    return new StructureCollection(db.collection('groups'));
  }
}

export class GroupsCollection {
  protected collection: Collection<GroupDocument>;

  constructor(collection: Collection<GroupDocument>) {
    this.collection = collection;
  }

  asStructCollection(): StructureCollection {
    return new StructureCollection(this.collection);
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

export class StructureCollection {
  protected collection: Collection<GroupDocument>;

  constructor(collection: Collection<GroupDocument>) {
    this.collection = collection;
  }

  asGroupCollection(): GroupsCollection {
    return new GroupsCollection(this.collection);
  }

  async insertStructure(groupId: string, struct: IGeoStruct) {
    await this.collection.updateOne(
      { id: groupId },
      { $push: { structures: struct } }
    );
  }

  async getOneStructure(
    groupId: string,
    structId: string
  ): Promise<IGeoStruct | null> {
    // A bit complicated aggregation,
    // gets specific structure from structures list from group
    return (await this.collection
      .aggregate([
        // select only the desired group
        { $match: { id: groupId } },
        // leave only the desired structure
        {
          $addFields: {
            structures: {
              $filter: {
                input: '$structures',
                cond: {
                  $eq: ['$$this.id', structId],
                },
              },
            },
          },
        },
        // replace list with the only structure on that structure object
        { $unwind: '$structures' },
        // replace root object with the desired structure
        { $replaceWith: '$structures' },
      ])
      .next()) as unknown as IGeoStruct | null;
  }

  async replaceObjectInStructure(
    groupId: string,
    structId: string,
    newObject: object
  ): Promise<boolean> {
    const res = await this.collection.updateOne(
      { id: groupId, 'structures.id': structId },
      { $set: { 'structures.$[element].struct': newObject } },
      { arrayFilters: [{ 'element.id': structId }] }
    );
    return res.modifiedCount > 0;
  }

  async deleteOneStructure(
    groupId: string,
    structId: string
  ): Promise<boolean> {
    const res = await this.collection.updateOne(
      { id: groupId },
      { $pull: { structures: { id: structId } } }
    );
    return res.modifiedCount > 0;
  }
}

interface GroupDocument extends Document, IGroupModel {}
