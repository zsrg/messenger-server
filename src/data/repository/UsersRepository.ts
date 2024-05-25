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
}

export default UsersRepository;
