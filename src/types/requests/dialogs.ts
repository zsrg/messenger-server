import { Response } from "express";
import { SessionRequest } from "./users";

export interface CreteDialogRequest extends SessionRequest {
  body: { userId: number };
}

export interface GetDialogsRequest extends SessionRequest { }

export interface DeleteDialogRequest extends SessionRequest {
  params: { dialogId: string };
}

export interface DialogsRequestUtils {
  checkDialogExists: (dialogId: number, res: Response) => Promise<any>;
  checkDialogAccess: (dialogId: number, userId: number, res: Response) => Promise<any>;
}
