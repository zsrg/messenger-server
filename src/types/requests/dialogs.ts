import { SessionRequest } from "./users";

export interface CreteDialogRequest extends SessionRequest {
  body: { userId: number };
}

export interface GetDialogsRequest extends SessionRequest { }

export interface DeleteDialogRequest extends SessionRequest {
  params: { dialogId: string };
}
