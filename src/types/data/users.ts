export interface SessionData {
  id: string;
  userId: number;
  creationDate: string;
  lastActivityDate: string;
}

export interface UserData {
  id: number;
  login: string;
  password?: string;
  name: string;
}
