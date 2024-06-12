import AttachmentsController from "./controller/AttachmentsController";
import cookieParser from "cookie-parser";
import cors from "cors";
import DialogsController from "./controller/DialogsController";
import dotenv from "dotenv";
import express, { json, NextFunction, Response } from "express";
import Files from "./helpers/Files";
import Logger, { HttpLogger } from "logger";
import MessagesController from "./controller/MessagesController";
import UsersController from "./controller/UsersController";
import { ATTACHMENTS_FOLDER, CONFIG_PATH, LOGS_FOLDER } from "./constants/path";
import { Client } from "pg";
import { Command } from "commander";
import { Config, HTTPStatus, Request } from "./types/common";
import { version } from "../package.json";

const { env, exit } = process;

dotenv.config({ path: [`.env.${env.NODE_ENV}.local`, `.env.${env.NODE_ENV}`] });

Files.createFolderIfNotExists(LOGS_FOLDER);
Files.createFolderIfNotExists(ATTACHMENTS_FOLDER);

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
const dialogsController = new DialogsController(client);
const messagesController = new MessagesController(client);
const attachmentsController = new AttachmentsController(client);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.utils = {
    checkUserExists: usersController.checkUserExists,
    checkDialogExists: dialogsController.checkDialogExists,
    checkDialogAccess: dialogsController.checkDialogAccess,
    getDialogUsers: dialogsController.getDialogUsers,
  };

  req.sendUpdate = usersController.sendUpdate;

  next();
});

// Session

app.post("/api/session", usersController.creteSession);

app.use(usersController.checkSession);

app.get("/api/session/:sessionId?", usersController.getSession);

app.get("/api/sessions", usersController.getSessions);

app.delete("/api/session/:sessionId?", usersController.deleteSession);

// Users

app.get("/api/user/:userId?", usersController.getUser);

app.get("/api/users", usersController.getUsers);

// Settings

app.put("/api/settings/password", usersController.changePassword);

app.put("/api/settings/name", usersController.changeName);

app.put("/api/settings/login", usersController.changeLogin);

// Dialogs

app.post("/api/dialogs/dialog", dialogsController.creteDialog);

app.get("/api/dialogs", dialogsController.getDialogs);

app.delete("/api/dialogs/dialog/:dialogId?", dialogsController.deleteDialog);

// Messages

app.post("/api/messages/message", messagesController.sendMessage);

app.get("/api/messages/dialog/:dialogId?", messagesController.getMessages);

app.delete("/api/messages/dialog/:dialogId?", messagesController.deleteDialogMessages);

// Attachments

app.post("/api/attachments/attachment", attachmentsController.createAttachment);

app.get("/api/attachments/:attachmentId?", attachmentsController.getAttachment);

app.delete("/api/attachments/dialog/:dialogId?", attachmentsController.deleteDialogAttachments);

// Subscription

app.get("/api/subscribe", usersController.subscribe);

app.use((err, req: Request, res: Response, next: NextFunction) => {
  return res.status(HTTPStatus.InternalServerError).json({ message: err.message });
});

app.use((req: Request, res: Response) => {
  return res.status(HTTPStatus.NotFound).json({ code: "UNKNOWN_REQUEST", message: "Unknown request" });
});

app.listen(server.port, () => {
  Logger.info(`Server listening on port ${server.port}`);
});
