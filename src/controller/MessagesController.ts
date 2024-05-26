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
      const { dialogId, text }: RequestsTypes.SendMessageRequest["body"] = req.body;
      const { userId }: RequestsTypes.SendMessageRequest["sessionData"] = req.sessionData;

      if (!dialogId) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Dialog id not specified" });
      }

      if (!(await req.utils.checkDialogExists(dialogId, res)) || !(await req.utils.checkDialogAccess(dialogId, userId, res))) {
        return;
      }

      const data: MessageData = await this.service.createMessage(dialogId, userId, text);
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
      const { limit = "1000", offset = "0" }: RequestsTypes.GetMessagesRequest["query"] = req.query;
      const { userId }: RequestsTypes.GetMessagesRequest["sessionData"] = req.sessionData;

      if (!dialogId) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Dialog id not specified" });
      }

      if (!(await req.utils.checkDialogExists(+dialogId, res)) || !(await req.utils.checkDialogAccess(+dialogId, userId, res))) {
        return;
      }

      const messages: MessageData[] = await this.service.getMessages(+dialogId, +limit, +offset);
      return res.status(HTTPStatus.OK).json(messages);

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
        return res.status(HTTPStatus.BadRequest).json({ message: "Dialog id not specified" });
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
