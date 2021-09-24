export interface IGroupModel {
  id: string;
  name: string;
  passcode?: string;
  inviteCode: string;
  users?: IUserModel[];
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
  a: boolean;
}
