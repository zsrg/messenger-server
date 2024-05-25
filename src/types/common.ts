import { ClientConfig } from "pg";

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
  InternalServerError = 500,
}
