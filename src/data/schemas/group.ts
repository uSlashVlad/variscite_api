import { IGeoStruct } from './structures';

export interface IGroupModel {
  id: string;
  name: string;
  passcode?: string;
  inviteCode: string;
  users?: IUserModel[];
  structures?: IGeoStruct[];
}

export interface IUserModel {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface IGroupInput {
  name: string;
  passcode: string | undefined;
}

export interface IUserJWT {
  g: string;
  u: string;
}
