import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, NextFunction, Request, Response } from "express";
import Files from "./helpers/Files";
import Logger, { HttpLogger } from "logger";
import UsersController from "./controller/UsersController";
import { Client } from "pg";
import { Command } from "commander";
import { Config, HTTPStatus } from "./types/common";
import { CONFIG_PATH, LOGS_FOLDER } from "./constants/path";
import { version } from "../package.json";

const { env, exit } = process;

dotenv.config({ path: [`.env.${env.NODE_ENV}.local`, `.env.${env.NODE_ENV}`] });

Files.createFolderIfNotExists(LOGS_FOLDER);

const command = new Command();
command.helpOption("-h, --help", "print command line options");
command.version(version, "-v, --version", "print version");
command.parse();

Logger.setLevel(env.NODE_ENV === "development" ? "DEBUG" : "INFO");
Logger.setFile(LOGS_FOLDER, "{{DATE}}.log");

const { server, database }: Config = Files.readFile(CONFIG_PATH) || {};

if (!server?.port || !database?.user || !database?.password || !database?.host || !database?.port || !database?.database) {
  Logger.critical("Invalid config");
  exit();
}

const app = express();
const client = new Client(database);

client.connect();

const httpLogger = new HttpLogger(Logger);
app.use(httpLogger.loggerMiddleware);

if (env.NODE_ENV === "development") {
  app.use(cors({ origin: true, credentials: true }));
}

app.use(json());
app.use(cookieParser());

const usersController = new UsersController(client);

// Session

app.post("/api/session", usersController.creteSession);

app.use(usersController.checkSession);

app.get("/api/session/:sessionId?", usersController.getSession);

app.get("/api/sessions", usersController.getSessions);

app.delete("/api/session/:sessionId?", usersController.deleteSession);

// Users

app.get("/api/user/:userId?", usersController.getUser);

app.get("/api/users", usersController.getUsers);

app.use((err, req: Request, res: Response, next: NextFunction) => {
  return res.status(HTTPStatus.InternalServerError).json({ message: err.message });
});

app.use((req: Request, res: Response) => {
  return res.status(HTTPStatus.NotFound).json({ message: "Unknown request" });
});

app.listen(server.port, () => {
  Logger.info(`Server listening on port ${server.port}`);
});
