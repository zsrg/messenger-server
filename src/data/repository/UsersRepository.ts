import Repository from "./Repository";
import { UserData } from "../../types/data/users";

class UsersRepository extends Repository {
  /**
   * Get user id by login and password
   * @param {string} login
   * @param {string} password
   * @returns {Promise<number>}
   */
  public async getUserIdByLoginPassword(login: string, password: string): Promise<number> {
    const data = await this.client.query(
      "SELECT id FROM users WHERE login = $1 and password = $2",
      [login, password]
    );

    return data.rows[0]?.id;
  }

  /**
   * Get user
   * @param {number} id
   * @returns {Promise<UserData>}
   */
  public async getUser(id: number): Promise<UserData> {
    const data = await this.client.query("SELECT * FROM users WHERE id = $1",
      [id]
    );

    return data.rows[0];
  }

  /**
   * Get users
   * @returns {Promise<UserData[]>}
   */
  public async getUsers(): Promise<UserData[]> {
    const data = await this.client.query(
      "SELECT id, login, name FROM users ORDER BY id"
    );

    return data.rows;
  }

  /**
   * Update password
   * @param {string} password
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async updatePassword(password: string, id: number): Promise<void> {
    await this.client.query("UPDATE users SET password = $1 WHERE id = $2",
      [password, id]
    );
  }

  /**
   * Update name
   * @param {string} name
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async updateName(name: string, id: number): Promise<void> {
    await this.client.query("UPDATE users SET name = $1 WHERE id = $2",
      [name, id]
    );
  }

  /**
   * Check login exists
   * @param {string} login
   * @returns {Promise<boolean>}
   */
  public async checkLoginExists(login: string): Promise<boolean> {
    const data = await this.client.query(
      "SELECT EXISTS (SELECT * FROM users WHERE login = $1)",
      [login]
    );

    return data.rows[0]?.exists;
  }

  /**
   * Update login
   * @param {string} login
   * @param {number} id
   * @returns {Promise<void>}
   */
  public async updateLogin(login: string, id: number): Promise<void> {
    await this.client.query("UPDATE users SET login = $1 WHERE id = $2",
      [login, id]
    );
  }
}

export default UsersRepository;
