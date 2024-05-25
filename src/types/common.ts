import { ClientConfig } from "pg";

export interface Config {
  server: ServerParams;
  database: ClientConfig;
}

export interface ServerParams {
  port: number;
}
