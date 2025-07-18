interface WithEmail {
  email: string;
}

interface WithOtp {
  otp: string;
}

interface WithPassword {
  password: string;
}

interface WithBusinessName {
  businessName: string;
}

interface WithFullName {
  fullName: string;
}

interface WithPin {
  pin: string;
}

interface WithToken {
  token: string;
}

// type AuthCredentials = WithEmail & WithPassword;

export type SignupData = WithBusinessName &
  WithFullName &
  WithEmail &
  WithPassword;

export type VerifyEmailData = WithEmail & WithOtp;

export type SigninData = WithEmail & WithPassword;

export type PinLoginData = WithPin;

export type ForgotPasswordData = WithEmail;

export type ResetPasswordData = WithEmail & WithToken & WithPassword;

