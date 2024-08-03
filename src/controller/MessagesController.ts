import * as RequestsTypes from "../types/requests/messages";
import Controller from "./Controller";
import MessagesService from "../service/MessagesService";
import { Client } from "pg";
import { HTTPStatus } from "../types/common";
import { MessageData } from "../types/data/messages";
import { Response } from "express";

class MessagesController extends Controller<MessagesService> {
  constructor(client: Client) {
    super();
    this.service = new MessagesService(client);
  }

  /**
   * Send message
   * @param {RequestsTypes.SendMessageRequest} req
   * @param {Response} res
   */
  public sendMessage = async (req: RequestsTypes.SendMessageRequest, res: Response) => {
    try {
      const { dialogId, text, attachmentId }: RequestsTypes.SendMessageRequest["body"] = req.body;
      const { userId }: RequestsTypes.SendMessageRequest["sessionData"] = req.sessionData;

      if (!dialogId) {
        return res.status(HTTPStatus.BadRequest).json({ code: "DIALOG_ID_NOT_SPECIFIED", message: "Dialog id not specified" });
      }

      if (!(await req.utils.checkDialogExists(dialogId, res)) || !(await req.utils.checkDialogAccess(dialogId, userId, res))) {
        return;
      }

      const data: MessageData = await this.service.createMessage(dialogId, userId, text, attachmentId);

      const users: number[] = await req.utils.getDialogUsers(dialogId, res);
      req.sendUpdate({ type: "NEW_MESSAGE", data, users }, req, res);

      return res.status(HTTPStatus.Created).json(data);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Get messages
   * @param {RequestsTypes.GetMessagesRequest} req
   * @param {Response} res
   */
  public getMessages = async (req: RequestsTypes.GetMessagesRequest, res: Response) => {
    try {
      const { dialogId }: RequestsTypes.GetMessagesRequest["params"] = req.params;
      const { sinceId = "-1", limit = "100" }: RequestsTypes.GetMessagesRequest["query"] = req.query;
      const { userId }: RequestsTypes.GetMessagesRequest["sessionData"] = req.sessionData;

      if (!dialogId) {
        return res.status(HTTPStatus.BadRequest).json({ code: "DIALOG_ID_NOT_SPECIFIED", message: "Dialog id not specified" });
      }

      if (!(await req.utils.checkDialogExists(+dialogId, res)) || !(await req.utils.checkDialogAccess(+dialogId, userId, res))) {
        return;
      }

      const messages: MessageData[] = await this.service.getMessages(+dialogId, +sinceId, +limit);
      return res.status(HTTPStatus.PartialContent).json(messages);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Delete dialog messages
   * @param {RequestsTypes.DeleteDialogMessagesRequest} req
   * @param {Response} res
   */
  public deleteDialogMessages = async (req: RequestsTypes.DeleteDialogMessagesRequest, res: Response) => {
    try {
      const { dialogId }: RequestsTypes.DeleteDialogMessagesRequest["params"] = req.params;
      const { userId }: RequestsTypes.DeleteDialogMessagesRequest["sessionData"] = req.sessionData;

      if (!dialogId) {
        return res.status(HTTPStatus.BadRequest).json({ code: "DIALOG_ID_NOT_SPECIFIED", message: "Dialog id not specified" });
      }

      if (!(await req.utils.checkDialogExists(+dialogId, res)) || !(await req.utils.checkDialogAccess(+dialogId, userId, res))) {
        return;
      }

      await this.service.deleteDialogMessages(+dialogId);
      return res.status(HTTPStatus.OK).json({ message: "Dialog messages deleted successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };
}

export default MessagesController;
