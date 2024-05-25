class Id {
  /**
   * Generate random id
   * @returns {string}
   */
  public static generate(): string {
    return Math.random().toString(16).slice(2);
  }
}

export default Id;
