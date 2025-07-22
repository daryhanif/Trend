import { InfisicalSDK } from "@infisical/sdk";
import dotenv from "dotenv";
dotenv.config({ path: ".env.production" });
const initInfisical = new InfisicalSDK({});

export default initInfisical;
