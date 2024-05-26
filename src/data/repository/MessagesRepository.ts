import Repository from "./Repository";
import { MessageDatabaseData } from "../../types/data/messages";

class MessagesRepository extends Repository {
  /**
   * Create message
   * @param {number} dialogId
   * @param {number} userId
   * @param {string} date
   * @param {string} text
   * @returns {Promise<MessageDatabaseData>}
   */
  public async createMessage(dialogId: number, userId: number, date: string, text: string): Promise<MessageDatabaseData> {
    const data = await this.client.query(
      `INSERT INTO messages (dialog_id, user_id, date, text) VALUES ($1, $2, $3, $4) RETURNING *`,
      [dialogId, userId, date, text]
    );

    return data.rows[0];
  }

  /**
   * Generate messages
   * @param {number} dialogId
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<MessageDatabaseData[]>}
   */
  public async getMessages(dialogId: number, limit: number, offset: number): Promise<MessageDatabaseData[]> {
    const data = await this.client.query(
      `SELECT * FROM (SELECT * FROM messages WHERE dialog_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3) AS messages ORDER BY id ASC`,
      [dialogId, limit, offset]
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
