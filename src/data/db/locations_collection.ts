import { Collection } from 'mongodb';

import { GroupDocument } from './db';
import {
  IGeolocation,
  IGeoPosition,
  IUserGeolocationOutput,
} from 'data/schemas/location';

export class LocationsCollection {
  protected collection: Collection<GroupDocument>;

  constructor(collection: Collection<GroupDocument>) {
    this.collection = collection;
  }

  async getAllUsersLocation(
    groupId: string
  ): Promise<IUserGeolocationOutput[] | null> {
    const group = await this.collection.findOne({ id: groupId });
    if (group) {
      const users = group.users!;

      let result: IUserGeolocationOutput[] = [];
      users.forEach((user) => {
        if (!user.location!.isHidden) {
          result.push({ user: user.id, position: user.location!.position });
        }
      });

      return result;
    } else {
      return null;
    }
  }

  async getUserLocation(
    groupId: string,
    userId: string
  ): Promise<IGeoPosition | null> {
    const location = (await this.collection
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
        { $replaceWith: '$users.location' },
      ])
      .next()) as unknown as IGeolocation | null;
    if (location != null && !location.isHidden) {
      return location.position;
    } else {
      return null;
    }
  }

  async updateUserLocation(
    groupId: string,
    userId: string,
    position: IGeoPosition
  ): Promise<boolean> {
    const res = await this.collection.updateOne(
      { id: groupId },
      {
        $set: {
          'users.$[element].location': { isHidden: false, position: position },
        },
      },
      { arrayFilters: [{ 'element.id': userId }] }
    );
    return res.modifiedCount > 0;
  }

  async eraseUserLocation(groupId: string, userId: string): Promise<boolean> {
    const res = await this.collection.updateOne(
      { id: groupId },
      {
        $set: {
          'users.$[element].location': {
            isHidden: true,
            position: { lat: 0, lon: 0 },
          },
        },
      },
      { arrayFilters: [{ 'element.id': userId }] }
    );
    return res.modifiedCount > 0;
  }
}
