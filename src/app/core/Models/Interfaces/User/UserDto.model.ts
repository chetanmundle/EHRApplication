export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginUserValidateOtpDto {
  email: string;
  otpValue: number;
}

export interface LoginUserResponseDto {
  userId: number;
  email: string;
  userName: string;
  userTypeName: string;
  accessToken: string;
}

export interface ForgetPasswordDto {
  email: string;
  otp: number;
  password: string;
  confirmPassword: string;
}
