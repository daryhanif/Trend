import { LoginManualRequest } from "../types/Auth-types";

class AuthServices {
  static LoginManual = (req: LoginManualRequest) => {
    const { email, password, username } = req;
  };
}
