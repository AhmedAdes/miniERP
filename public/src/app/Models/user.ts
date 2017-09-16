export class User {
  UserID: number;
  UserName: string;
  LoginName: string;
  UserPass: string;
  JobClass: string;
  RequestDate: Date;
  DirectManager: number;
  Approved: boolean;
  ApproveUser: number;
  Email: string;
  Phone: string;
}

export class CurrentUser {
  userID: number;
  userName: string;
  photo: ImageData;
  isAdmin: boolean;
  token: string;
}


export const CurrentLoggedUser: CurrentUser = {
  userID: null,
  userName: null,
  photo: null,
  isAdmin: null,
  token: null,
}