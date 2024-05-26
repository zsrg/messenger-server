import * as RequestsTypes from "../types/requests/attachments";
import AttachmentsService from "../service/AttachmentsService";
import Controller from "./Controller";
import Files from "../helpers/Files";
import { AttachmentData } from "../types/data/attachments";
import { Client } from "pg";
import { HTTPStatus } from "../types/common";
import { Response } from "express";

class AttachmentsController extends Controller<AttachmentsService> {
  constructor(client: Client) {
    super();
    this.service = new AttachmentsService(client);
  }

  /**
   * Create attachment
   * @param {RequestsTypes.CreteAttachmentRequest} req
   * @param {Response} res
   */
  public createAttachment = async (req: RequestsTypes.CreteAttachmentRequest, res: Response) => {
    try {
      const { dialogId, base64 }: RequestsTypes.CreteAttachmentRequest["body"] = req.body;
      const { userId }: RequestsTypes.CreteAttachmentRequest["sessionData"] = req.sessionData;

      if (!dialogId || !base64) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Dialog id or base64 not specified" });
      }

      if (!(await req.utils.checkDialogExists(dialogId, res)) || !(await req.utils.checkDialogAccess(dialogId, userId, res))) {
        return;
      }

      const fileType: string = Files.getFileType(base64);

      if (fileType !== "png" && fileType !== "jpg" && fileType !== "jpeg") {
        return res.status(HTTPStatus.UnsupportedMediaType).json({ message: "Unsupported media type" });
      }

      const data: AttachmentData = await this.service.createAttachment(dialogId, base64);
      return res.status(HTTPStatus.Created).json(data);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Get attachment
   * @param {RequestsTypes.GetAttachmentRequest} req
   * @param {Response} res
   */
  public getAttachment = async (req: RequestsTypes.GetAttachmentRequest, res: Response) => {
    try {
      const { attachmentId }: RequestsTypes.GetAttachmentRequest["params"] = req.params;
      const { userId }: RequestsTypes.GetAttachmentRequest["sessionData"] = req.sessionData;

      if (!attachmentId) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Attachment id not specified" });
      }

      const { dialogId, file }: AttachmentData = (await this.service.getAttachment(+attachmentId)) || {} as AttachmentData;

      if (!file) {
        return res.status(HTTPStatus.NotFound).json({ message: "Attachment not found" });
      }

      if (!(await req.utils.checkDialogExists(dialogId, res)) || !(await req.utils.checkDialogAccess(dialogId, userId, res))) {
        return;
      }

      return res.status(HTTPStatus.OK).end(file);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Delete dialog attachments
   * @param {RequestsTypes.DeleteDialogAttachmentsRequest} req
   * @param {Response} res
   */
  public deleteDialogAttachments = async (req: RequestsTypes.DeleteDialogAttachmentsRequest, res: Response) => {
    try {
      const { dialogId }: RequestsTypes.DeleteDialogAttachmentsRequest["params"] = req.params;
      const { userId }: RequestsTypes.DeleteDialogAttachmentsRequest["sessionData"] = req.sessionData;

      if (!dialogId) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Dialog id not specified" });
      }

      if (!(await req.utils.checkDialogExists(+dialogId, res)) || !(await req.utils.checkDialogAccess(+dialogId, userId, res))) {
        return;
      }

      await this.service.deleteDialogAttachments(+dialogId);
      return res.status(HTTPStatus.OK).json({ message: "Attachments deleted successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };
}

export default AttachmentsController;
