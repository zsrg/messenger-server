import { Request as ExpressRequest } from "express";
import { SessionData } from "../data/users";

export interface CreteSessionRequest extends ExpressRequest {
  body: { login: string; password: string };
}

export interface SessionRequest extends ExpressRequest {
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
