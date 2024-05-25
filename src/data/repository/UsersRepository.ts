import Repository from "./Repository";

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
}

export default UsersRepository;
