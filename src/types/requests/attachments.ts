import { SessionRequest } from "./users";

export interface CreteAttachmentRequest extends SessionRequest {
  body: { dialogId: number; base64: string };
}

export interface GetAttachmentRequest extends SessionRequest {
  params: { attachmentId: string };
}

export interface DeleteDialogAttachmentsRequest extends SessionRequest {
  params: { dialogId: string };
}
