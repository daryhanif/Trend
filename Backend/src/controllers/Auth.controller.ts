import { NextFunction, Request, Response } from "express";
import AuthServices from "@/services/Auth.services";
import Busboy from "busboy";
class AuthController {
  static Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const LoginService = await AuthServices.LoginManual(req.body);
      res.status(200).json({ message: "Login Success", data: LoginService });

      if (LoginService.typeClinet === "WEB") {
        const { refreshToken, typeClinet, ...safeLoginService } = LoginService;
        res
          .cookie("refreshToken", LoginService.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({ message: "Login Success", data: safeLoginService });
      }
    } catch (err) {
      next(err);
    }
  };
  static RegistersEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const RegistersEmail = await AuthServices.RegisterEmail(req.body);
      res.status(200).json(RegistersEmail);
    } catch (err) {
      next(err);
    }
  };
  static UploadProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const busboy = Busboy({ headers: req.headers });
    let isDone: boolean = false;
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    let totalSize = 0;
    let fileRejected = false;
    busboy.on("file");
  };
}
export default AuthController;
