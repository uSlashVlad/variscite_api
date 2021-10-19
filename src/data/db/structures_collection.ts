import { Collection } from 'mongodb';
import { GroupDocument } from './db';

import { IGeoStruct } from '../schemas/structure';

export class StructuresCollection {
  protected collection: Collection<GroupDocument>;

  constructor(collection: Collection<GroupDocument>) {
    this.collection = collection;
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
      { id: groupId },
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

  async getFields(groupId: string, structId: string): Promise<object | null> {
    // A bit complicated aggregation,
    // gets fields property of the desired structure from group
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
        { $replaceWith: '$structures.fields' },
      ])
      .next()) as unknown as object | null;
  }

  async updateFields(
    groupId: string,
    structId: string,
    fields: Map<string, any>
  ): Promise<boolean> {
    const dbFields: Map<string, any> = new Map();
    fields.forEach((val, key) => {
      dbFields.set('structures.$[element].fields.' + key, val);
    });
    const res = await this.collection.updateOne(
      { id: groupId },
      { $set: dbFields },
      { arrayFilters: [{ 'element.id': structId }] }
    );
    return res.modifiedCount > 0;
  }

  async removeFields(
    groupId: string,
    structId: string,
    fields: string[]
  ): Promise<boolean> {
    const dbUnset: Map<string, string> = new Map();
    for (let i = 0; i < fields.length; i++) {
      dbUnset.set('structures.$[element].fields.' + fields[i], '');
    }
    console.log(dbUnset);
    const res = await this.collection.updateOne(
      { id: groupId },
      { $unset: dbUnset },
      { arrayFilters: [{ 'element.id': structId }] }
    );
    return res.modifiedCount > 0;
  }
}
