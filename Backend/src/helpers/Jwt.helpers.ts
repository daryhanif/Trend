import { JWTPayload, SignJWT } from "jose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
export interface Payload {
  id: string;
}
export interface Security {
  algo: string;
  exp: number | Date | string;
  iat?: number | Date | string;
  typeToken: "access" | "refresh";
}
export class JwtHelpers {
  static async createToken(payload: JWTPayload, security: Security) {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({
        alg: security.algo,
      })
      .setExpirationTime(security.exp)
      .setIssuedAt(security.iat)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY as string));
    return token;
  }
}
