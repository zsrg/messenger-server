import Repository from "./Repository";
import { DialogData } from "../../types/data/dialogs";

class DialogsRepository extends Repository {
  /**
   * Create dialog
   * @param {number[]} usersIds
   * @returns {Promise<DialogData>}
   */
  public async createDialog(usersIds: number[]): Promise<DialogData> {
    const data = await this.client.query(
      "INSERT INTO dialogs (users) VALUES ($1) RETURNING *",
      [usersIds]
    );

    return data.rows[0];
  }

  /**
   * Get dialogs
   * @param {number} userId
   * @returns {Promise<DialogData[]>}
   */
  public async getDialogs(userId: number): Promise<DialogData[]> {
    const data = await this.client.query(
      "SELECT * FROM dialogs WHERE users @> ARRAY[$1]::integer[] ORDER BY id",
      [userId]
    );

    return data.rows;
  }

  /**
   * Delete dialog
   * @param {number} dialogId
   * @returns {Promise<void>}
   */
  public async deleteDialog(dialogId: number): Promise<void> {
    await this.client.query("DELETE FROM dialogs WHERE id = $1",
      [dialogId]
    );
  }

  /**
   * Check dialog exists
   * @param {number} dialogId
   * @returns {Promise<boolean>}
   */
  public async checkDialogExists(dialogId: number): Promise<boolean> {
    const data = await this.client.query(
      "SELECT EXISTS (SELECT * FROM dialogs WHERE id = $1)",
      [dialogId]
    );

    return data.rows[0]?.exists;
  }

  /**
   * Check dialog exists by users
   * @param {number[]} usersIds
   * @returns {Promise<boolean>}
   */
  public async checkDialogExistsByUsers(usersIds: number[]): Promise<boolean> {
    const data = await this.client.query(
      "SELECT EXISTS (SELECT * FROM dialogs WHERE users @> $1)",
      [usersIds]
    );

    return data.rows[0]?.exists;
  }

  /**
   * Check user exists on dialog
   * @param {number} dialogId
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  public async checkUserExistsOnDialog(dialogId: number, userId: number): Promise<boolean> {
    const data = await this.client.query(
      "SELECT EXISTS (SELECT * FROM dialogs WHERE id = $1 AND users @> ARRAY[$2]::integer[])",
      [dialogId, userId]
    );

    return data.rows[0]?.exists;
  }
}

export default DialogsRepository;
