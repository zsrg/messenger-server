import { SessionRequest } from "./users";

export interface SendMessageRequest extends SessionRequest {
  body: { dialogId: number; text?: string; attachmentId?: number };
}

export interface GetMessagesRequest extends SessionRequest {
  params: { dialogId: string };
  query: { sinceId: string; limit: string; };
}

export interface DeleteDialogMessagesRequest extends SessionRequest {
  params: { dialogId: string };
}
