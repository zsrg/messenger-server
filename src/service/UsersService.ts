import Id from "../helpers/Id";
import Service from "./Service";
import Session from "../data/dto/Session";
import UsersRepository from "../data/repository/UsersRepository";
import { Client } from "pg";
import { Response } from "express";
import { SessionData, UserData } from "../types/data/users";

class UsersService extends Service<UsersRepository> {
  private sessions: Map<string, Session>;
  private subscriptions: Map<string, Response>;

  constructor(client: Client) {
    super();
    this.repository = new UsersRepository(client);
    this.sessions = new Map();
    this.subscriptions = new Map();
  }

  /**
   * Create session
   * @param {string} login
   * @param {string} password
   * @returns {Promise<SessionData>}
   */
  public async createSession(login: string, password: string): Promise<SessionData> {
    const userId = await this.repository.getUserIdByLoginPassword(login, password);

    if (!userId) {
      return;
    }

    const id = Id.generate();
    const date = new Date().toISOString();

    const session = new Session();
    session.setId(id);
    session.setUserId(userId);
    session.setCreationDate(date);

    this.sessions.set(id, session);

    return this.getSessionData(id);
  }

  /**
   * Get session data
   * @param {string} id
   * @param {boolean} [updateActivity=true]
   * @returns {SessionData}
   */
  public getSessionData(id: string, updateActivity: boolean = true): SessionData {
    const session = this.sessions.get(id);

    if (session) {
      if (updateActivity) {
        const date = new Date().toISOString();
        session.setLastActivityDate(date);
      }

      return this.getSessionObject(session);
    }
  }

  /**
   * Get user sessions
   * @param {number} userId
   * @returns {SessionData[]}
   */
  public getUserSessions(userId: number): SessionData[] {
    const sessions: SessionData[] = [];

    this.sessions.forEach((session: Session) => {
      if (session.getUserId() === userId) {
        sessions.push(this.getSessionObject(session));
      }
    });

    return sessions;
  }

  /**
   * Delete session
   * @param {string} id
   * @returns {void}
   */
  public deleteSession(id: string): void {
    this.sessions.delete(id);
  }

  /**
   * Get user
   * @param {number} userId
   * @param {boolean} [excludePassword=true]
   * @returns {Promise<UserData>}
   */
  public async getUser(userId: number, excludePassword: boolean = true): Promise<UserData> {
    const data = await this.repository.getUser(userId);

    if (data && excludePassword) {
      delete data.password;
    }

    return data;
  }

  /**
   * Get users
   * @returns {Promise<UserData[]>}
   */
  public async getUsers(): Promise<UserData[]> {
    return await this.repository.getUsers();
  }

  /**
   * Update password
   * @param {string} password
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async updatePassword(password: string, id: number): Promise<void> {
    await this.repository.updatePassword(password, id);
  }

  /**
   * Update name
   * @param {string} name
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async updateName(name: string, id: number): Promise<void> {
    await this.repository.updateName(name, id);
  }

  /**
   * Check login exists
   * @param {string} login
   * @returns {Promise<boolean>}
   */
  public async checkLoginExists(login: string): Promise<boolean> {
    return await this.repository.checkLoginExists(login);
  }

  /**
   * Update login
   * @param {string} login
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async updateLogin(login: string, id: number): Promise<void> {
    await this.repository.updateLogin(login, id);
  }

  /**
   * Check user exists
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  public async checkUserExists(userId: number): Promise<boolean> {
    return await this.repository.checkUserExists(userId);
  }

  /**
   * Subscribe
   * @param {string} id
   * @param {Response} res
   * @returns {void}
   */
  public subscribe(id: string, res: Response): void {
    this.subscriptions.set(id, res);
  }

  /**
   * Get subscription
   * @param {string} id
   * @returns {Response}
   */
  public getSubscription(id: string): Response {
    return this.subscriptions.get(id);
  }

  /**
   * Unsubscribe
   * @param {string} id
   * @returns {void}
   */
  public unsubscribe(id: string): void {
    this.subscriptions.delete(id);
  }

  /**
   * Get session object
   * @param {Session} session
   * @returns {SessionData}
   */
  private getSessionObject(session: Session): SessionData {
    return {
      id: session.getId(),
      userId: session.getUserId(),
      creationDate: session.getCreationDate(),
      lastActivityDate: session.getLastActivityDate(),
    };
  }
}

export default UsersService;
