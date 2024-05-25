class Session {
  private id: string;
  private userId: number;
  private creationDate: string;
  private lastActivityDate: string;

  constructor() {
    this.id = null;
    this.userId = null;
    this.creationDate = null;
    this.lastActivityDate = null;
  }

  /**
   * Get id
   * @returns {string}
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Set id
   * @param {string} id
   * @returns {void}
   */
  public setId(id: string): void {
    this.id = id;
  }

  /**
   * Get user id
   * @returns {number}
   */
  public getUserId(): number {
    return this.userId;
  }

  /**
   * Set user id
   * @param {number} userId
   * @returns {void}
   */
  public setUserId(userId: number): void {
    this.userId = userId;
  }

  /**
   * Get creation date
   * @returns {string}
   */
  public getCreationDate(): string {
    return this.creationDate;
  }

  /**
   * Set creation date
   * @param {string} creationDate
   * @returns {void}
   */
  public setCreationDate(creationDate: string): void {
    this.creationDate = creationDate;
  }

  /**
   * Get last activity date
   * @returns {string}
   */
  public getLastActivityDate(): string {
    return this.lastActivityDate;
  }

  /**
   * Set last activity date
   * @param {string} lastActivityDate
   * @returns {void}
   */
  public setLastActivityDate(lastActivityDate: string): void {
    this.lastActivityDate = lastActivityDate;
  }
}

export default Session;
