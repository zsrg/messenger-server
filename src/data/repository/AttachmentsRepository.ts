import Repository from "./Repository";
import { AttachmentDatabaseData } from "../../types/data/attachments";

class AttachmentsRepository extends Repository {
  /**
   * Create attachment
   * @param {string} path
   * @param {number} dialogId
   * @returns {Promise<AttachmentDatabaseData>}
   */
  public async createAttachment(path: string, dialogId: number): Promise<AttachmentDatabaseData> {
    const data = await this.client.query(
      "INSERT INTO attachments (path, dialog_id) VALUES ($1, $2) RETURNING *",
      [path, dialogId]
    );

    return data.rows[0];
  }

  /**
   * Get attachment
   * @param {number} attachmentId
   * @returns {Promise<AttachmentDatabaseData>}
   */
  public async getAttachment(attachmentId: number): Promise<AttachmentDatabaseData> {
    const data = await this.client.query(
      "SELECT * FROM attachments WHERE id = $1",
      [attachmentId]
    );

    return data.rows[0];
  }

  /**
   * Delete dialog attachments
   * @param {number} dialogId
   * @returns {Promise<void>}
   */
  public async deleteDialogAttachments(dialogId: number): Promise<void> {
    await this.client.query("DELETE FROM attachments WHERE dialog_id = $1",
      [dialogId]
    );
  }
}

export default AttachmentsRepository;
