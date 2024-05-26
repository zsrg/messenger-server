import { SessionRequest } from "./users";

export interface SendMessageRequest extends SessionRequest {
  body: { dialogId: number; text?: string };
}

export interface GetMessagesRequest extends SessionRequest {
  params: { dialogId: string };
  query: { limit: string; offset: string };
}

export interface DeleteDialogMessagesRequest extends SessionRequest {
  params: { dialogId: string };
}
