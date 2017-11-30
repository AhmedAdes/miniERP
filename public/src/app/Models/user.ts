export class User {
  UserID: number;
  UserName: string;
  Password: string;
  JobClass: string;
  RequestDate: Date;
  DirectManager: number;
  Approved: boolean;
  ApproveUser: number;
  Email: string;
  Phone: string;
  Photo: string;
}

export class CurrentUser {
  userID: number;
  userName: string;
  photo: ImageData;
  // isAdmin: boolean;
  token: string;
  salt: string;
  jobClass: number;  
}


export const CurrentLoggedUser: CurrentUser = {
  userID: null,
  userName: null,
  photo: null,
  // isAdmin: null,
  token: null,
  salt: null,
  jobClass: null,
}