import dotenv from "dotenv";
import express, { Response } from "express";
import Files from "./helpers/Files";
import Logger, { HttpLogger } from "logger";
import { Client } from "pg";
import { Command } from "commander";
import { Config } from "./types/common";
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

app.get("/", (_, res: Response) => {
  res.status(200).send("messenger-server");
});

app.listen(server.port, () => {
  Logger.info(`Server listening on port ${server.port}`);
});
