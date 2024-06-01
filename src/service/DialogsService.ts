import DialogsRepository from "../data/repository/DialogsRepository";
import Service from "./Service";
import { Client } from "pg";
import { DialogData } from "../types/data/dialogs";

class DialogsService extends Service<DialogsRepository> {
  constructor(client: Client) {
    super();
    this.repository = new DialogsRepository(client);
  }

  /**
   * Create dialog
   * @param {number[]} usersIds
   * @returns {Promise<DialogData>}
   */
  public async createDialog(usersIds: number[]): Promise<DialogData> {
    return await this.repository.createDialog(usersIds);
  }

  /**
   * Get dialogs
   * @param {number} userId
   * @returns {Promise<DialogData[]>}
   */
  public async getDialogs(userId: number): Promise<DialogData[]> {
    return await this.repository.getDialogs(userId);
  }

  /**
   * Get dialog
   * @param {number} dialogId
   * @returns {Promise<DialogData>}
   */
  public async getDialog(dialogId: number): Promise<DialogData> {
    return await this.repository.getDialog(dialogId);
  }

  /**
   * Delete dialod
   * @param {number} dialogId
   * @returns {Promise<void>}
   */
  public async deleteDialog(dialogId: number): Promise<void> {
    await this.repository.deleteDialog(dialogId);
  }

  /**
   * Check dialog exists
   * @param {number} dialogId
   * @returns {Promise<boolean>}
   */
  public async checkDialogExists(dialogId: number): Promise<boolean> {
    return await this.repository.checkDialogExists(dialogId);
  }

  /**
   * Check dialog exists by users
   * @param {number[]} usersIds
   * @returns {Promise<boolean>}
   */
  public async checkDialogExistsByUsers(usersIds: number[]): Promise<boolean> {
    return await this.repository.checkDialogExistsByUsers(usersIds);
  }

  /**
   * Check user exists on dialog
   * @param {number} dialogId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  public async checkUserExistsOnDialog(dialogId: number, userId: number): Promise<boolean> {
    return await this.repository.checkUserExistsOnDialog(dialogId, userId);
  }
}

export default DialogsService;
