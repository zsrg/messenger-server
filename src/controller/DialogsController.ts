import * as RequestsTypes from "../types/requests/dialogs";
import Controller from "./Controller";
import DialogsService from "../service/DialogsService";
import { Client } from "pg";
import { DialogData } from "../types/data/dialogs";
import { HTTPStatus } from "../types/common";
import { Response } from "express";

class DialogsController extends Controller<DialogsService> {
  constructor(client: Client) {
    super();
    this.service = new DialogsService(client);
  }

  /**
   * Create dialog
   * @param {RequestsTypes.CreteDialogRequest} req
   * @param {Response} res
   */
  public creteDialog = async (req: RequestsTypes.CreteDialogRequest, res: Response) => {
    try {
      const { userId }: RequestsTypes.CreteDialogRequest["body"] = req.body;
      const { userId: currentUserId }: RequestsTypes.CreteDialogRequest["sessionData"] = req.sessionData;

      if (!userId) {
        return res.status(HTTPStatus.BadRequest).json({ message: "User id not specified" });
      }

      if (!await req.utils.checkUserExists(userId, res)) {
        return;
      }

      const users: number[] = [currentUserId, userId];

      if (await this.service.checkDialogExistsByUsers(users)) {
        return res.status(HTTPStatus.Conflict).json({ message: "Dialog already exists" });
      }

      const data: DialogData = await this.service.createDialog(users);
      return res.status(HTTPStatus.Created).json(data);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Get dialogs
   * @param {RequestsTypes.GetDialogsRequest} req
   * @param {Response} res
   */
  public getDialogs = async (req: RequestsTypes.GetDialogsRequest, res: Response) => {
    try {
      const { userId }: RequestsTypes.GetDialogsRequest["sessionData"] = req.sessionData;

      const dialogs: DialogData[] = await this.service.getDialogs(userId);

      return res.status(HTTPStatus.OK).json(dialogs);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Delete dialog
   * @param {RequestsTypes.DeleteDialogRequest} req
   * @param {Response} res
   */
  public deleteDialog = async (req: RequestsTypes.DeleteDialogRequest, res: Response) => {
    try {
      const { dialogId }: RequestsTypes.DeleteDialogRequest["params"] = req.params;
      const { userId }: RequestsTypes.DeleteDialogRequest["sessionData"] = req.sessionData;

      if (!dialogId) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Dialog id not specified" });
      }

      if (!(await req.utils.checkDialogExists(+dialogId, res)) || !(await req.utils.checkDialogAccess(+dialogId, userId, res))) {
        return;
      }

      await this.service.deleteDialog(+dialogId);
      return res.status(HTTPStatus.OK).json({ message: "Dialog deleted successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Check dialog exists
   * @param {number} dialogId
   * @param {Response} res
   */
  public checkDialogExists = async (dialogId: number, res: Response) => {
    try {
      const dialogExists: boolean = await this.service.checkDialogExists(dialogId);

      if (!dialogExists) {
        res.status(HTTPStatus.NotFound).json({ message: "Dialog not found" });
      }

      return dialogExists;

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Check dialog access
   * @param {number} dialogId
   * @param {number} userId
   * @param {Response} res
   */
  public checkDialogAccess = async (dialogId: number, userId: number, res: Response) => {
    try {
      const dialogAccess: boolean = await this.service.checkUserExistsOnDialog(dialogId, userId);

      if (!dialogAccess) {
        res.status(HTTPStatus.Forbidden).json({ message: "User not in dialog" });
      }

      return dialogAccess;

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };
}

export default DialogsController;
