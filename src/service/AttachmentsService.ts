import AttachmentsRepository from "../data/repository/AttachmentsRepository";
import Files from "../helpers/Files";
import Id from "../helpers/Id";
import Service from "./Service";
import { AttachmentData, AttachmentDatabaseData } from "../types/data/attachments";
import { ATTACHMENTS_FOLDER } from "../constants/path";
import { Client } from "pg";
import { join } from "path";

class AttachmentsService extends Service<AttachmentsRepository> {
  constructor(client: Client) {
    super();
    this.repository = new AttachmentsRepository(client);
  }

  /**
   * Create attachment
   * @param {number} dialogId
   * @param {string} base64
   * @returns {Promise<AttachmentData>}
   */
  public async createAttachment(dialogId: number, base64: string): Promise<AttachmentData> {
    const fileName: string = `${Id.generate()}.${Files.getFileType(base64)}`;
    const fileData: string = Files.getFileData(base64);

    const dialogAttachmentsPath: string = join(ATTACHMENTS_FOLDER, `${dialogId}`);
    const relativeFilePath: string = join(`${dialogId}`, fileName);
    const fullFilePath: string = join(ATTACHMENTS_FOLDER, `${dialogId}`, fileName);

    Files.createFolderIfNotExists(dialogAttachmentsPath);
    Files.writeFile(fullFilePath, fileData);

    const data: AttachmentDatabaseData = await this.repository.createAttachment(relativeFilePath, dialogId);

    return this.toCamelCase(data);
  }

  /**
   * Get attachment
   * @param {number} attachmentId
   * @returns {Promise<AttachmentData>}
   */
  public async getAttachment(attachmentId: number): Promise<AttachmentData> {
    const data: AttachmentDatabaseData = await this.repository.getAttachment(attachmentId);

    if (!data) {
      return;
    }

    const fullFilePath: string = join(ATTACHMENTS_FOLDER, data.path);
    const file: Buffer = Files.readFile(fullFilePath);

    return { ...this.toCamelCase(data), file };
  }

  /**
   * Delete dialog attachments
   * @param {number} dialogId
   * @returns {Promise<void>}
   */
  public async deleteDialogAttachments(dialogId: number): Promise<void> {
    const dialogAttachmentsPath: string = join(ATTACHMENTS_FOLDER, `${dialogId}`);
    Files.deleteFolderIfExists(dialogAttachmentsPath);

    await this.repository.deleteDialogAttachments(dialogId);
  }

  /**
   * To camel case
   * @param {AttachmentDatabaseData} data
   * @returns {AttachmentData}
   */
  private toCamelCase({ dialog_id, ...data }: AttachmentDatabaseData): AttachmentData {
    return { ...data, dialogId: dialog_id };
  }
}

export default AttachmentsService;
