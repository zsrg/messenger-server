import Service from "../service/Service";

class Controller<T = Service> {
  protected service: T;
}

export default Controller;
