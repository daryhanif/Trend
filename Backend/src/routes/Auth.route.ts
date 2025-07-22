import AuthController from "@/controllers/Auth.controller";
import { Router } from "express";


const routerAuth = Router();

routerAuth.post("/login", AuthController.Login);
routerAuth.post("/register-email", AuthController.RegistersEmail);
routerAuth.post("/validate-email", AuthController.ValidateEmail);
routerAuth.post("/register-account", AuthController.);
routerAuth.post("/login-provider", AuthController.LoginProvider);
routerAuth.post("/logout", AuthController.Logout);

export default routerAuth;
