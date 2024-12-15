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
