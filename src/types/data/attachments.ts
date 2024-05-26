export interface AttachmentDatabaseData {
  id: number;
  path: string;
  dialog_id: number;
}

export interface AttachmentData {
  id: number;
  path: string;
  dialogId: number;
  file?: Buffer;
}
