import { Client } from "pg";

class Repository {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}

export default Repository;
