import { ClientConfig } from "pg";
import { Request as ExpressRequest } from "express";
import { UsersRequestUtils } from "./requests/users";

export interface Config {
  server: ServerParams;
  database: ClientConfig;
}

export interface ServerParams {
  port: number;
}

export enum HTTPStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export interface Request extends ExpressRequest {
  utils: UsersRequestUtils;
}
