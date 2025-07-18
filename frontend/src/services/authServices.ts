// services/authService.ts
import {
  SignupData,
  ForgotPasswordData,
  PinLoginData,
  SigninData,
  VerifyEmailData,
  ResetPasswordData,
} from "@/types/authTypes";
import { HttpService } from "./httpService";
import { COOKIE_NAMES } from "@/utils/cookiesUtils";

class AuthService {
  private request = new HttpService();

  async signup(data: SignupData) {
    return this.request.post("/auth/signup", data);
  }

  async verifyEmail({ email, otp }: VerifyEmailData) {
    return this.request.post("/auth/verify", { email, otp });
  }

  async signin(data: SigninData) {
    return this.request.post("/auth/login", {
      email: data.email,
      passCode: data.password,
      mode: "password",
    });
  }

  async pinLogin(data: PinLoginData) {
    // Pass cookie NAME, not the token string
    return this.request.post(
      "/auth/set-pin",
      { pin: data.pin },
      COOKIE_NAMES.BOUNTIP_REGISTERED_USERS
      // "bountipRegisteredUsers"
    );
  }

  async forgotPassword(data: ForgotPasswordData) {
    return this.request.post("/auth/forgot-password", data);
  }

  async resetPassword(data: ResetPasswordData) {
    return this.request.post("/auth/reset-password", {
      otp: data.token,
      email: data.email,
      newPassword: data.password,
    });
  }
}

const authService = new AuthService();
export default authService;
