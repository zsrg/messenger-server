import * as RequestsTypes from "../types/requests/users";
import Controller from "./Controller";
import UsersService from "../service/UsersService";
import { Client } from "pg";
import { HTTPStatus } from "../types/common";
import { NextFunction, Response } from "express";
import { SessionData } from "../types/data/users";

class UsersController extends Controller<UsersService> {
  constructor(client: Client) {
    super();
    this.service = new UsersService(client);
  }

  /**
   * Create session
   * @param {RequestsTypes.CreteSessionRequest} req
   * @param {Response} res
   */
  public creteSession = async (req: RequestsTypes.CreteSessionRequest, res: Response) => {
    try {
      const { login, password }: RequestsTypes.CreteSessionRequest["body"] = req.body;

      if (!login || !password) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Login or password not specified" });
      }

      const sessionData: SessionData = await this.service.createSession(login, password);

      if (!sessionData) {
        return res.status(HTTPStatus.Forbidden).json({ message: "Invalid login or password" });
      }

      res.cookie("sessionId", sessionData.id, { httpOnly: true });

      return res.status(HTTPStatus.Created).json(sessionData);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Check session
   * @param {RequestsTypes.CheckSessionRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public checkSession = (req: RequestsTypes.CheckSessionRequest, res: Response, next: NextFunction) => {
    try {
      const { sessionId }: RequestsTypes.CheckSessionRequest["cookies"] = req.cookies;

      if (!sessionId) {
        return res.status(HTTPStatus.BadRequest).json({ message: "Session id not specified" });
      }

      const sessionData: SessionData = this.service.getSessionData(sessionId);

      if (!sessionData) {
        return res.status(HTTPStatus.Unauthorized).json({ message: "Invalid session id" });
      }

      req.sessionData = sessionData;

      next();

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Get session
   * @param {RequestsTypes.GetSessionRequest} req
   * @param {Response} res
   */
  public getSession = (req: RequestsTypes.GetSessionRequest, res: Response) => {
    try {
      const { sessionId }: RequestsTypes.GetSessionRequest["params"] = req.params;
      const { userId }: RequestsTypes.GetSessionRequest["sessionData"] = req.sessionData;

      if (sessionId) {
        const sessionData: SessionData = this.service.getSessionData(sessionId, false);

        if (!sessionData) {
          return res.status(HTTPStatus.NotFound).json({ message: "Session with given id not found" });
        }

        if (sessionData.userId !== userId) {
          return res.status(HTTPStatus.Forbidden).json({ message: "Session is owned by another user" });
        }

        return res.status(HTTPStatus.OK).json(sessionData);
      }

      return res.status(HTTPStatus.OK).json(req.sessionData);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Get sessions
   * @param {RequestsTypes.GetSessionsRequest} req
   * @param {Response} res
   */
  public getSessions = (req: RequestsTypes.GetSessionsRequest, res: Response) => {
    try {
      const { userId }: RequestsTypes.GetSessionsRequest["sessionData"] = req.sessionData;

      const sessionsData: SessionData[] = this.service.getUserSessions(userId);

      return res.status(HTTPStatus.OK).json(sessionsData);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Delete session
   * @param {RequestsTypes.DeleteSessionRequest} req
   * @param {Response} res
   */
  public deleteSession = (req: RequestsTypes.DeleteSessionRequest, res: Response) => {
    try {
      const { sessionId: paramsSessionId }: RequestsTypes.DeleteSessionRequest["params"] = req.params;
      const { id: currentSessionId, userId }: RequestsTypes.DeleteSessionRequest["sessionData"] = req.sessionData;

      if (paramsSessionId) {
        const sessionData: SessionData = this.service.getSessionData(paramsSessionId, false);

        if (!sessionData) {
          return res.status(HTTPStatus.NotFound).json({ message: "Session with given id not found" });
        }

        if (sessionData.userId !== userId) {
          return res.status(HTTPStatus.Forbidden).json({ message: "Session is owned by another user" });
        }

        this.service.deleteSession(paramsSessionId);
        return res.status(HTTPStatus.OK).json({ message: "Session deleted successfully" });
      }

      this.service.deleteSession(currentSessionId);
      return res.status(HTTPStatus.OK).json({ message: "Session deleted successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };
}

export default UsersController;
