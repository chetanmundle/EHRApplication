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