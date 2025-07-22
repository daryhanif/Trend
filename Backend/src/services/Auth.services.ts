import {
  LoginManualRequest,
  LoginResponse,
  RegisterEmailRequest,
  RegisterEmailResponse,
} from "@/types/Auth.types";
import AuthValidations from "@/validation/Auth.validation";
import { db } from "@/app/db/mysql/mysql.drizzle";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { eq, or } from "drizzle-orm";
import ErrorHandler from "@/app/.config/erorHandler.config";
import { JwtHelpers } from "@/helpers/Jwt.helpers";
import { Login, User } from "@/models/mysql/Auth.model.mysql";
class AuthServices {
  static LoginManual = async (
    req: LoginManualRequest
  ): Promise<LoginResponse> => {
    const { email, password, username, typeClinet, idDevice } = req;
    const filteredRequest: LoginManualRequest =
      AuthValidations.LOGINMANUAL.parse({
        email,
        password,
        username,
        typeClinet,
        idDevice,
      });
    const findUser = await db
      .select()
      .from(User)
      .where(
        or(
          eq(User.email, filteredRequest.email as string),
          eq(User.username, filteredRequest.username as string)
        )
      );
    if (!findUser) {
      throw new ErrorHandler(400, "User or password not match");
    }
    const comparePassEncrypted = await bcrypt.compare(
      filteredRequest.password,
      findUser[0].password
    );
    if (!comparePassEncrypted) {
      throw new ErrorHandler(400, "User or password not match");
    }
    const tokenRefresh = await JwtHelpers.createToken(
      {
        id: findUser[0].id_user,
      },
      {
        typeToken: "access",
        algo: "RS256",
        exp: "15d",
      }
    );
    const tokenAccsess = await JwtHelpers.createToken(
      {
        id: findUser[0].id_user,
      },
      {
        typeToken: "access",
        algo: "RS256",
        exp: "1d",
      }
    );

    const insertLoginHistory = await db.insert(Login).values({
      id_login: uuidv4() as string,
      id_user: findUser[0].id_user,
      refresh_token: tokenRefresh,
      id_device: idDevice,
      expires_at: new Date(Date.now() + 15 * 864e5),
      type_device: typeClinet, // "IOS", "ANDROID", or "WEB"
      // created_at: new Date(), // optional; omit to use defaultNow()
    });
    if (!insertLoginHistory) {
      throw new ErrorHandler(503, "Service Unavailable");
    }
    return {
      refreshToken: tokenRefresh,
      accessToken: tokenAccsess,
      typeClinet,
      imgUser: findUser[0].img_profile,
      username: findUser[0].username,
    };
  };
  static LoginProvider = async () => {};
  static RegisterEmail = async (
    req: RegisterEmailRequest
  ): Promise<RegisterEmailResponse> => {
    const { email } = req;
    const filteredRequest = AuthValidations.REGISTEREMAIL.parse({
      email,
    });

    const findUser = await db
      .select()
      .from(User)
      .where(eq(User.email, filteredRequest.email as string));
    if (findUser) {
      throw new ErrorHandler(400, "Email already exist");
    }
    const;
    return {
      cooldown: 0,
    };
  };
  static ValidateEmail = async () => {};
  static RegisterAccount = async () => {};
}

export default AuthServices;
