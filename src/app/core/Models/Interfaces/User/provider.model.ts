export interface RegisterProvidertDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  stateId: number;
  countryId: number;
  zipCode: number;
  qualification: string;
  specialisationId: number;
  registrationNumber: string;
  visitingCharge: number;
  profileImage: string;
}

export interface UserWithIdNameDto {
  userId: number;
  firstName: string;
  lastName: string;
  visitingCharge: number;
}
