// Login Type

export interface LoginManualRequest {
  email?: string;
  username?: string;
  password: string;
  typeClinet: "WEB" | "ANDROID" | "IOS";
  idDevice: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  username: string;
  imgUser: string;
  typeClinet: "WEB" | "ANDROID" | "IOS";
}

export interface LoginProviderRequest {
  id_provider: string;
}
export interface RegisterEmailRequest {
  email: string;
}
export interface RegisterEmailResponse {
  cooldown: number | Date | string;
}
export interface ValidateEmailRequest {
  email: string;
  code: string;
}

export interface ValidateEmailResponse {
  statusValidationEmail: boolean;
}
