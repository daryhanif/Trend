import { NextFunction, Request, Response } from "express";
import AuthServices from "@/services/Auth.services";
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
      const RegistersEmail = await AuthServices.registersEmailService(req.body);
      res.status(200).json(RegistersEmail);
    } catch (err) {
      next(err);
    }
  };
}
export default AuthController;
