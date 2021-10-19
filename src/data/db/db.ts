import { MongoClient, Document } from 'mongodb';
import { IGroupModel } from 'data/schemas/group';
import { GroupsCollection } from './groups_collection';
import { StructuresCollection } from './structures_collection';
import { LocationsCollection } from './locations_collection';

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

  async closeDB(): Promise<void> {
    await this.client.close();
    console.log('MongoDB connection is closed');
  }

  getGroupsCollection(): GroupsCollection {
    let db = this.client.db();
    return new GroupsCollection(db.collection('groups'));
  }

  getStructuresCollection(): StructuresCollection {
    let db = this.client.db();
    return new StructuresCollection(db.collection('groups'));
  }

  getLocationCollection(): LocationsCollection {
    let db = this.client.db();
    return new LocationsCollection(db.collection('groups'));
  }
}

export interface GroupDocument extends Document, IGroupModel {}
