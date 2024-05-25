import Repository from "../data/repository/Repository";

class Service<T = Repository> {
  protected repository: T;
}

export default Service;
