import { Request } from "../common";
import { Response } from "express";
import { SessionData } from "../data/users";
export interface CreteSessionRequest extends Request {
  body: { login: string; password: string };
}

export interface SessionRequest extends Request {
  cookies: { sessionId: string };
  sessionData: SessionData;
}

export interface CheckSessionRequest extends SessionRequest { }

export interface GetSessionRequest extends SessionRequest {
  params: { sessionId?: string };
}

export interface GetSessionsRequest extends SessionRequest { }

export interface DeleteSessionRequest extends SessionRequest {
  params: { sessionId?: string };
}

export interface GetUsersRequest extends SessionRequest { }

export interface GetUserRequest extends SessionRequest {
  params: { userId?: string };
}

export interface ChangePasswordRequest extends SessionRequest {
  body: { currentPassword: string; newPassword: string };
}

export interface ChangeNameRequest extends SessionRequest {
  body: { newName: string };
}

export interface ChangeLoginRequest extends SessionRequest {
  body: { newLogin: string };
}

export interface UsersRequestUtils {
  checkUserExists: (userId: number, res: Response) => Promise<any>;
}
