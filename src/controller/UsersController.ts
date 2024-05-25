import * as RequestsTypes from "../types/requests/users";
import Controller from "./Controller";
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
        return res.status(HTTPStatus.NotFound).json({ message: "User not found" });
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
        return res.status(HTTPStatus.BadRequest).json({ message: "Current or new password not specified" });
      }

      const userData: UserData = await this.service.getUser(userId, false);

      if (currentPassword !== userData?.password) {
        return res.status(HTTPStatus.Forbidden).json({ message: "Invalid current password" });
      }

      if (currentPassword === newPassword) {
        return res.status(HTTPStatus.Conflict).json({ message: "Current and new passwords are the same" });
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
        return res.status(HTTPStatus.BadRequest).json({ message: "New name not specified" });
      }

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
        return res.status(HTTPStatus.BadRequest).json({ message: "New login not specified" });
      }

      const userData: UserData = await this.service.getUser(userId);

      if (userData.login === newLogin) {
        return res.status(HTTPStatus.Conflict).json({ error: "SAME_LOGIN", message: "Current and new login are the same" });
      }

      if (await this.service.checkLoginExists(newLogin)) {
        return res.status(HTTPStatus.Conflict).json({ error: "LOGIN_EXISTS", message: "New login already exists" });
      }

      await this.service.updateLogin(newLogin, userId);
      return res.status(HTTPStatus.OK).json({ message: "Login updated successfully" });

    } catch (e) {
      return res.status(HTTPStatus.InternalServerError).json({ message: e.message });
    }
  };
}

export default UsersController;
