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
  id_verify: string;
  cooldown: number | Date | string;
  email: string;
}
export interface ValidateEmailRequest {
  id_verify: string;
  email: string;
  code: string;
}
export interface RedisValidate extends ValidateEmailRequest {
  cooldown: number | Date | string;
  expriresAt: number | Date | string;
}
export interface ValidateEmailResponse {
  statusValidationEmail: boolean;
}

export interface RegisterAccountRequest {
  imgProfile: string;
  displayName: string;
  username: string;
  email: string;
  password: string;
  id_provider?: string;
}

export interface SqlRegisterAccount extends RegisterAccountRequest {
  id_user: string;
}
