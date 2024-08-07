import Repository from "./Repository";
import { MessageDatabaseData } from "../../types/data/messages";

class MessagesRepository extends Repository {
  /**
   * Create message
   * @param {number} dialogId
   * @param {number} userId
   * @param {string} date
   * @param {string} text
   * @param {number} attachmentId
   * @returns {Promise<MessageDatabaseData>}
   */
  public async createMessage(dialogId: number, userId: number, date: string, text: string, attachmentId: number): Promise<MessageDatabaseData> {
    const data = await this.client.query(
      `INSERT INTO messages (dialog_id, user_id, date, text, attachment_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [dialogId, userId, date, text, attachmentId]
    );

    return data.rows[0];
  }

  /**
   * Get messages
   * @param {number} dialogId
   * @param {number} sinceId
   * @param {number} limit
   * @returns {Promise<MessageDatabaseData[]>}
   */
  public async getMessages(dialogId: number, sinceId: number, limit: number): Promise<MessageDatabaseData[]> {
    const data = await this.client.query(
      `SELECT * FROM (SELECT * FROM messages WHERE dialog_id = $1 AND (id < $2 OR $2 = -1) ORDER BY id DESC LIMIT $3) AS messages ORDER BY id ASC`,
      [dialogId, sinceId, limit]
    );

    return data.rows;
  }

  /**
   * Delete dialog messages
   * @param {number} dialogId
   * @returns {Promise<void>}
   */
  public async deleteDialogMessages(dialogId: number): Promise<void> {
    await this.client.query(
      "DELETE FROM messages WHERE dialog_id = $1",
      [dialogId]
    );
  }
}

export default MessagesRepository;
