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

export interface UserNameIdDto {
  userId: number;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordDto {
  userName: string;
  password: string;
  confirmPassword: string;
}

export interface UserDto {
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  stateId: number;
  countryId: number;
  zipCode: number;
  userTypeId: number;
  qualification: null;
  specialisationId: null;
  registrationNumber: null;
  visitingCharge: null;
  profileImage: string;
}

export interface UpdateUserDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  bloodGroup: string;
  address: string;
  qualification: string;
  specialisationId: number;
  registrationNumber: string;
  visitingCharge: number;
  profileImage: string;
}
