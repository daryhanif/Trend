import z, { ZodSchema } from "zod";
import xss from "xss";

class AuthValidations {
  static LOGINMANUAL: ZodSchema = z.object({
    username: z
      .string()
      .optional()
      .transform((val) => xss((val || "").trim())),
    email: z
      .string()
      .email()
      .optional()
      .transform((val) => xss((val || "").trim())),
    password: z.string().transform((val) => xss(val.trim())),
    typeClinet: z.enum(["WEB", "ANDROID", "IOS"]), // enum sudah pasti valid, gak perlu xss/trim
    idDevice: z.string().transform((val) => xss(val.trim())),
  });

  static LOGINPROVIDER = z.object({
    id_provider: z.string().transform((val) => xss(val.trim())),
  });

  static REGISTEREMAIL = z.object({
    email: z
      .string()
      .email()
      .transform((val) => xss(val.trim())),
  });

  static VALIDATEEMAIL = z.object({
    email: z
      .string()
      .email()
      .transform((val) => xss(val.trim())),
    code: z.string().transform((val) => xss(val.trim())),
  });

  static REGISTERACCOUNT = z.object({
    username: z.string().transform((val) => xss(val.trim())),
    displayname: z.string().transform((val) => xss(val.trim())),
    email: z
      .string()
      .email()
      .transform((val) => xss(val.trim())),
    password: z.string().transform((val) => xss(val.trim())),
  });
}

export default AuthValidations;
