import dotenv from "dotenv";
import express, { Response } from "express";
import Files from "./helpers/Files";
import { Command } from "commander";
import { Config } from "./types/common";
import { CONFIG_PATH } from "./constants/path";
import { version } from "../package.json";

const { env, exit } = process;

dotenv.config({ path: [`.env.${env.NODE_ENV}.local`, `.env.${env.NODE_ENV}`] });

const command = new Command();
command.helpOption("-h, --help", "print command line options");
command.version(version, "-v, --version", "print version");
command.parse();

const { server }: Config = Files.readFile(CONFIG_PATH) || {};

if (!server?.port) {
  console.log("Invalid config");
  exit();
}

const app = express();

app.get("/", (_, res: Response) => {
  res.status(200).send("messenger-server");
});

app.listen(server.port, () => {
  console.log(`Server listening on port ${server.port}`);
});
