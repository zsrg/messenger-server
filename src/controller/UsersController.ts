import * as RequestsTypes from "../types/requests/users";
import Controller from "./Controller";
import Logger from "logger";
import UsersService from "../service/UsersService";
import { Client } from "pg";
import { HTTPStatus } from "../types/common";
import { NextFunction, Response } from "express";
import { SessionData, UserData } from "../types/data/users";

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
        return res.status(HTTPStatus.BadRequest).json({ code: "LOGIN_OR_PASSWORD_NOT_SPECIFIED", message: "Login or password not specified" });
      }

      const sessionData: SessionData = await this.service.createSession(login, password);

      if (!sessionData) {
        return res.status(HTTPStatus.Forbidden).json({ code: "INVALID_LOGIN_OR_PASSWORD", message: "Invalid login or password" });
      }

      res.cookie("sessionId", sessionData.id, { httpOnly: true });

      req.sendUpdate({ type: "NEW_SESSION", data: sessionData, users: sessionData.userId }, { ...req, sessionData } as RequestsTypes.SessionRequest, res);

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
        return res.status(HTTPStatus.BadRequest).json({ code: "SESSION_ID_NOT_SPECIFIED", message: "Session id not specified" });
      }

      const sessionData: SessionData = this.service.getSessionData(sessionId);

      if (!sessionData) {
        return res.status(HTTPStatus.Unauthorized).json({ code: "INVALID_SESSION_ID", message: "Invalid session id" });
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
          return res.status(HTTPStatus.NotFound).json({ code: "SESSION_NOT_FOUND", message: "Session with given id not found" });
        }

        if (sessionData.userId !== userId) {
          return res.status(HTTPStatus.Forbidden).json({ code: "OTHER_USERS_SESSION", message: "Session is owned by another user" });
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
          return res.status(HTTPStatus.NotFound).json({ code: "SESSION_NOT_FOUND", message: "Session with given id not found" });
        }

        if (sessionData.userId !== userId) {
          return res.status(HTTPStatus.Forbidden).json({ code: "OTHER_USERS_SESSION", message: "Session is owned by another user" });
        }

        req.sendUpdate({ type: "DELETE_SESSION", data: paramsSessionId, users: userId }, req, res);

        this.service.unsubscribe(paramsSessionId);
        this.service.deleteSession(paramsSessionId);

        return res.status(HTTPStatus.OK).json({ message: "Session deleted successfully" });
      }

      req.sendUpdate({ type: "DELETE_SESSION", data: currentSessionId, users: userId }, req, res);

      this.service.unsubscribe(currentSessionId);
      this.service.deleteSession(currentSessionId);

      return res.status(HTTPStatus.OK).json({ message: "Session deleted successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Get user
   * @param {RequestsTypes.GetUserRequest} req
   * @param {Response} res
   */
  public getUser = async (req: RequestsTypes.GetUserRequest, res: Response) => {
    try {
      const { userId: paramsUserId }: RequestsTypes.GetUserRequest["params"] = req.params;
      const { userId: currentUserId }: RequestsTypes.GetUserRequest["sessionData"] = req.sessionData;

      const userId: number = paramsUserId ? +paramsUserId : currentUserId;
      const userData: UserData = await this.service.getUser(userId);

      if (!userData) {
        return res.status(HTTPStatus.NotFound).json({ code: "USER_NOT_FOUND", message: "User not found" });
      }

      return res.status(HTTPStatus.OK).json(userData);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Get users
   * @param {RequestsTypes.GetUsersRequest} req
   * @param {Response} res
   */
  public getUsers = async (req: RequestsTypes.GetUsersRequest, res: Response) => {
    try {
      const users: UserData[] = await this.service.getUsers();

      return res.status(HTTPStatus.OK).json(users);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Change password
   * @param {RequestsTypes.ChangePasswordRequest} req
   * @param {Response} res
   */
  public changePassword = async (req: RequestsTypes.ChangePasswordRequest, res: Response) => {
    try {
      const { currentPassword, newPassword }: RequestsTypes.ChangePasswordRequest["body"] = req.body;
      const { userId }: RequestsTypes.ChangePasswordRequest["sessionData"] = req.sessionData;

      if (!currentPassword || !newPassword) {
        return res.status(HTTPStatus.BadRequest).json({ code: "PASSWORD_NOT_SPECIFIED", message: "Current or new password not specified" });
      }

      const userData: UserData = await this.service.getUser(userId, false);

      if (currentPassword !== userData?.password) {
        return res.status(HTTPStatus.Forbidden).json({ code: "INVALID_PASSWORD", message: "Invalid current password" });
      }

      if (currentPassword === newPassword) {
        return res.status(HTTPStatus.Conflict).json({ code: "SAME_PASSWORD", message: "Current and new passwords are the same" });
      }

      await this.service.updatePassword(newPassword, userId);

      return res.status(HTTPStatus.OK).json({ message: "Password updated successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Change name
   * @param {RequestsTypes.ChangeNameRequest} req
   * @param {Response} res
   */
  public changeName = async (req: RequestsTypes.ChangeNameRequest, res: Response) => {
    try {
      const { newName }: RequestsTypes.ChangeNameRequest["body"] = req.body;
      const { userId }: RequestsTypes.ChangeNameRequest["sessionData"] = req.sessionData;

      if (!newName) {
        return res.status(HTTPStatus.BadRequest).json({ code: "NAME_NOT_SPECIFIED", message: "New name not specified" });
      }

      req.sendUpdate({ type: "UPDATE_NAME", data: newName, users: userId }, req, res);

      await this.service.updateName(newName, userId);

      return res.status(HTTPStatus.OK).json({ message: "Name updated successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Change login
   * @param {RequestsTypes.ChangeLoginRequest} req
   * @param {Response} res
   */
  public changeLogin = async (req: RequestsTypes.ChangeLoginRequest, res: Response) => {
    try {
      const { newLogin }: RequestsTypes.ChangeLoginRequest["body"] = req.body;
      const { userId }: RequestsTypes.ChangeLoginRequest["sessionData"] = req.sessionData;

      if (!newLogin) {
        return res.status(HTTPStatus.BadRequest).json({ code: "LOGIN_NOT_SPECIFIED", message: "New login not specified" });
      }

      const userData: UserData = await this.service.getUser(userId);

      if (userData.login === newLogin) {
        return res.status(HTTPStatus.Conflict).json({ code: "SAME_LOGIN", message: "Current and new login are the same" });
      }

      if (await this.service.checkLoginExists(newLogin)) {
        return res.status(HTTPStatus.Conflict).json({ code: "LOGIN_EXISTS", message: "New login already exists" });
      }

      req.sendUpdate({ type: "UPDATE_LOGIN", data: newLogin, users: userId }, req, res);

      await this.service.updateLogin(newLogin, userId);

      return res.status(HTTPStatus.OK).json({ message: "Login updated successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Subscribe
   * @param {RequestsTypes.SessionRequest} req
   * @param {Response} res
   */
  public subscribe = async (req: RequestsTypes.SessionRequest, res: Response) => {
    try {
      const { id }: RequestsTypes.SessionRequest["sessionData"] = req.sessionData;

      res.setHeader("Content-Type", "text/event-stream");
      res.flushHeaders();

      this.service.subscribe(id, res);

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Send update
   * @param {RequestsTypes.UpdateData} data
   * @param {RequestsTypes.SessionRequest} req
   * @param {Response} res
   */
  public sendUpdate = async ({ type, data, users }: RequestsTypes.UpdateData, req: RequestsTypes.SessionRequest, res: Response) => {
    try {
      (Array.isArray(users) ? users : [users]).forEach((userId: number) => {
        const sessions: SessionData[] = this.service.getUserSessions(userId);

        sessions.forEach((sessionData: SessionData) => {
          const subscription: Response = this.service.getSubscription(sessionData.id);

          if (!subscription || (req.sessionData?.userId === sessionData.userId && req.sessionData?.id === sessionData.id)) {
            return;
          }

          subscription.write(`data: ${JSON.stringify({ type, data })}\n\n`);
          Logger.debug(`Send update ${type} to ${sessionData.id}`);
        });
      })
    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };

  /**
   * Check user exists
   * @param {number} userId
   * @param {Response} res
   */
  public checkUserExists = async (userId: number, res: Response) => {
    try {
      const userExists: boolean = await this.service.checkUserExists(userId);

      if (!userExists) {
        res.status(HTTPStatus.NotFound).json({ code: "USER_NOT_FOUND", message: "User not found" });
      }

      return userExists;

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };
}

export default UsersController;
