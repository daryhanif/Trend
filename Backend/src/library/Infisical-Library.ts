import initInfisical from "@/app/.config/Infisical.config";
import ErrorHandler from "@/app/.config/erorHandler.config";
class InfisicalLbirary {
  static getInfisical = async (Key: string) => {
    try {
      const secret = await initInfisical.secrets().getSecret({
        environment: "production",
        secretName: Key,
        projectId: process.env.INFISICAL_PROJECT_ID as string,
      });
      return secret;
    } catch (error) {
      throw new ErrorHandler(500, error as string);
    }
  };
}
export default InfisicalLbirary;
