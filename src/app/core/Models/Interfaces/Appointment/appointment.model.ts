export interface BookAppointmentDto {
  patientId: number;
  providerId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  chiefComplaint: string;
}

export interface PayAndBookAppointmentDto {
  patientId: number;
  providerId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  chiefComplaint: string;
  sourceToken: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}

export interface GetAppoinmentByPatientIdDto {
  appointmentId: number;
  patientId: number;
  providerId: number;
  providerName: string;
  appointmentDate: string;
  appointmentTime: string;
  startTime: string;
  endTime: string;
  appointmentStatus: string;
  chiefComplaint: string;
  fee: number;
}

export interface GetAppoinmentByProviderIdDto {
  appointmentId: number;
  patientId: number;
  providerId: number;
  appointmentDate: string;
  appointmentTime: string;
  startTime: string;
  endTime: string;
  appointmentStatus: string;
  chiefComplaint: string;
  fee: number;
  patientName: string;
  profileImage: string;
  gender: string;
  age: number;
  bloodGroup: string;
}

export interface AppointmentWithSOAPNotesDto {
  appointmentId: number;
  patientId: number;
  providerId: number;
  patientName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  profileImage: string;
  appointmentDate: string;
  appointmentTime: string;
  startTime: string;
  endTime: string;
  appointmentStatus: string;
  chiefComplaint: string;
  fee: number;
  soapNotesId: null;
  subjective: null;
  objective: null;
  assessment: null;
  plan: null;
}
