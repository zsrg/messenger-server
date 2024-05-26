import MessagesRepository from "../data/repository/MessagesRepository";
import Service from "./Service";
import { Client } from "pg";
import { MessageData, MessageDatabaseData } from "../types/data/messages";

class MessagesService extends Service<MessagesRepository> {
  constructor(client: Client) {
    super();
    this.repository = new MessagesRepository(client);
  }

  /**
   * Create message
   * @param {number} dialogId
   * @param {number} userId
   * @param {string} text
   * @returns {Promise<MessageData>}
   */
  public async createMessage(dialogId: number, userId: number, text: string): Promise<MessageData> {
    const date: string = new Date().toISOString();
    const data: MessageDatabaseData = await this.repository.createMessage(dialogId, userId, date, text);
    return this.toCamelCase(data);
  }

  /**
   * Get messages
   * @param {number} dialogId
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<MessageData[]>}
   */
  public async getMessages(dialogId: number, limit: number, offset: number): Promise<MessageData[]> {
    return (await this.repository.getMessages(dialogId, limit, offset))?.map(
      (data: MessageDatabaseData) => this.toCamelCase(data)
    );
  }

  /**
   * Delete dialog messages
   * @param {number} dialogId
   * @returns {Promise<void>}
   */
  public async deleteDialogMessages(dialogId: number): Promise<void> {
    await this.repository.deleteDialogMessages(dialogId);
  }

  /**
   * To camel case
   * @param {MessageDatabaseData} data
   * @returns {MessageData}
   */
  private toCamelCase({ dialog_id, user_id, ...data }: MessageDatabaseData): MessageData {
    return { ...data, dialogId: dialog_id, userId: user_id };
  }
}

export default MessagesService;
