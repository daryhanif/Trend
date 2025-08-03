import {
  LoginManualRequest,
  LoginResponse,
  RedisValidate,
  RegisterAccountRequest,
  RegisterEmailRequest,
  RegisterEmailResponse,
  SqlRegisterAccount,
  ValidateEmailRequest,
  ValidateEmailResponse,
} from "@/types/Auth.types";
import AuthValidations from "@/validation/Auth.validation";
import { db } from "@/app/db/mysql/mysql.drizzle";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { and, eq, gt, or } from "drizzle-orm";
import ErrorHandler from "@/app/.config/erorHandler.config";
import { JwtHelpers } from "@/helpers/Jwt.helpers";
import { EmailVerify, Login, User } from "@/models/mysql/Auth.model.mysql";
import redis from "@/app/redis/redis.config";
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
        algorithm: "RS256",
        expiresIn: "15d",
      }
    );
    const tokenAccsess = await JwtHelpers.createToken(
      {
        id: findUser[0].id_user,
      },
      {
        typeToken: "access",
        algorithm: "RS256",
        expiresIn: "1d",
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
    const findUserRedis = await redis.get(
      ("ValidateEmail:" + filteredRequest.email) as string
    );
    if (findUserRedis) {
      const redisEmailValidateParsed = await JSON.parse(findUserRedis);
      if (Date.now() < redisEmailValidateParsed.expiresAt) {
        return {
          cooldown: redisEmailValidateParsed.cooldown,
          email: redisEmailValidateParsed.email,
          id_verify: redisEmailValidateParsed.id_verify,
        };
      }
    }
    const EmailValidateToDb = await db
      .select()
      .from(EmailVerify)
      .where(
        and(
          eq(EmailVerify.email, filteredRequest.email as string),
          gt(EmailVerify.cooldown, new Date()) // ✅ pakai Date langsung
        )
      );

    if (EmailValidateToDb) {
      return {
        cooldown: EmailValidateToDb[0].cooldown,
        email: EmailValidateToDb[0].email,
        id_verify: EmailValidateToDb[0].id_verify,
      };
    }
    const EmailVerifyFullData = {
      id_verify: uuidv4() as string,
      email: filteredRequest.email as string,
      cooldown: new Date(Date.now() + 1 * 60 * 1000),
      code_verify: String(Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)),
      created_at: new Date(),
      expires_at: new Date(Date.now() + 1 * 864e5),
    };
    const InsertEmailVerify = await db.insert(EmailVerify).values({
      ...EmailVerifyFullData,
    });
    const InsertEmailVerifyRedis = await redis.set(
      ("ValidateEmail:" + filteredRequest.email) as string,
      JSON.stringify(EmailVerifyFullData)
    );
    if (!InsertEmailVerifyRedis) {
      throw new ErrorHandler(503, "Service Unavailable");
    }
    if (!InsertEmailVerify) {
    }
    return {
      cooldown: EmailVerifyFullData.cooldown,
      email: EmailVerifyFullData.email,
      id_verify: EmailVerifyFullData.id_verify,
    };
  };
  static ValidateEmail = async (
    req: ValidateEmailRequest
  ): Promise<ValidateEmailResponse> => {
    const { id_verify, email, code } = req;
    const filteredRequest = AuthValidations.VALIDATEEMAIL.parse({
      id_verify,
      email,
      code,
    });

    const findEmailVerifyRedis = await redis.get(
      ("ValidateEmail:" + filteredRequest.email) as string
    );
    if (findEmailVerifyRedis) {
      const findEmailVerifyRedisParsed: RedisValidate = await JSON.parse(
        findEmailVerifyRedis
      );
      if (
        findEmailVerifyRedisParsed.code == String(filteredRequest.code) &&
        findEmailVerifyRedisParsed.id_verify == filteredRequest.id_verify &&
        findEmailVerifyRedisParsed.email == filteredRequest.email &&
        findEmailVerifyRedisParsed.expriresAt >= new Date(Date.now())
      ) {
        return {
          statusValidationEmail: true,
        };
      }
    }

    const findEmailVerify = await db
      .select()
      .from(EmailVerify)
      .where(
        and(
          eq(EmailVerify.email, filteredRequest.email as string),
          eq(EmailVerify.id_verify, filteredRequest.id_verify as string),
          eq(EmailVerify.code_verify, String(filteredRequest.code)),
          gt(EmailVerify.expires_at, new Date())
        )
      );
    if (!findEmailVerify) {
      throw new ErrorHandler(400, "Invalid code");
    }
    return {
      statusValidationEmail: true,
    };
  };

  static RegisterAccount = async (
    req: RegisterAccountRequest
  ): Promise<any> => {
    const { imgProfile, displayName, username, email, password } = req;
    const filteredRequest = AuthValidations.REGISTERACCOUNT.parse({
      imgProfile,
      displayName,
      username,
      email,
      password,
    });
    const findUser = await db
      .select()
      .from(User)
      .where(eq(User.email, filteredRequest.email as string));
    if (findUser) {
      throw new ErrorHandler(400, "Email already exist");
    }
    const EmailVerifyFullData: SqlRegisterAccount = {
      id_user: uuidv4() as string,
      email: filteredRequest.email as string,
      img_profile: filteredRequest.imgProfile as string,
      display_name: filteredRequest.displayName as string,
      username: filteredRequest.username as string,
      password: await bcrypt.hash(filteredRequest.password as string, 10),
    };
    const insertUserAccount = await db.insert(User).values({
      i,
    });
    if (!insertUserAccount) {
      throw new ErrorHandler(503, "Service Unavailable");
    }
    return insertUserAccount;
  };
}

export default AuthServices;
