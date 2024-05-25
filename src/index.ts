import dotenv from "dotenv";
import express, { Response } from "express";
import Files from "./helpers/Files";
import { Config } from "./types/common";
import { CONFIG_PATH } from "./constants/path";

const { env, exit } = process;

dotenv.config({ path: [`.env.${env.NODE_ENV}.local`, `.env.${env.NODE_ENV}`] });

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
