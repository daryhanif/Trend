import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import type { JwtPayload, Algorithm, SignOptions } from "jsonwebtoken";

dotenv.config({ path: ".env.development" });

export interface Payload {
  id: string;
}

export interface Security extends SignOptions {
  typeToken: "access" | "refresh";
}

export interface Token_Key {
  publicKey: string;
  privateKey: string;
}

export class JwtHelpers {
  private static Token_Key: Token_Key = {
    publicKey: "",
    privateKey: "",
  };

  static async createToken(
    payload: Payload,
    security: Security
  ): Promise<string> {
    const isAccess = security.typeToken === "access";

    JwtHelpers.Token_Key.publicKey = process.env[
      isAccess ? "PUBLIC_KEY_JWT_ACCESS" : "PUBLIC_KEY_JWT_REFRESH"
    ] as string;

    JwtHelpers.Token_Key.privateKey = process.env[
      isAccess ? "PRIVATE_KEY_JWT_ACCESS" : "PRIVATE_KEY_JWT_REFRESH"
    ] as string;

    const options: SignOptions = {
      algorithm: security.algorithm,
      expiresIn: security.expiresIn,
      issuer: "DaryHaniF",
    };

    return jsonwebtoken.sign(payload, JwtHelpers.Token_Key.privateKey, options);
  }
}
