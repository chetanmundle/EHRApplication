import { inject, Injectable } from '@angular/core';
import {
  AppointmentWithSOAPNotesDto,
  BookAppointmentDto,
  GetAppoinmentByPatientIdDto,
  GetAppoinmentByProviderIdDto,
  PayAndBookAppointmentDto,
  UpdateAppointmentDto,
} from '../../Models/Interfaces/Appointment/appointment.model';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import { CommonService } from '../commonService/common-service.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private commonService = inject(CommonService);

  // Book ApointmentBy
  BookAppointmentByProvider$(
    payload: BookAppointmentDto
  ): Observable<AppResponse<null>> {
    return this.commonService.post<AppResponse<null>>(
      `Appointment/BookAppointment`,
      payload
    );
  }
  // Book ApointmentBy Patient
  PayAndBookAppointmentByPatient$(
    payload: PayAndBookAppointmentDto
  ): Observable<AppResponse<null>> {
    return this.commonService.post<AppResponse<null>>(
      `Appointment/PaymentBookAppointment`,
      payload
    );
  }

  // Get patient apoinments by theire id
  GetAppointmentByPatientId$(
    patientId: number,
    status: string
  ): Observable<AppResponse<GetAppoinmentByPatientIdDto[]>> {
    return this.commonService.get<AppResponse<GetAppoinmentByPatientIdDto[]>>(
      `Appointment/GetAppoinmentsByPatientId/${patientId}/${status}`
    );
  }

  // Get Providers Appointment which is booked by custoemer
  GetAppointmentByProviderId$(
    providerId: number,
    status: string
  ): Observable<AppResponse<GetAppoinmentByProviderIdDto[]>> {
    return this.commonService.get<AppResponse<GetAppoinmentByProviderIdDto[]>>(
      `Appointment/GetAppoinmentsByProvidertId/${providerId}/${status}`
    );
  }

  CancelAppointmentByApptId$(
    appointmentId: number
  ): Observable<AppResponse<null>> {
    return this.commonService.delete<AppResponse<null>>(
      `Appointment/CancelAppointmentById/${appointmentId}`
    );
  }

  GetAppointmentWithSOAPNotes$(
    appoinmentId: number
  ): Observable<AppResponse<AppointmentWithSOAPNotesDto>> {
    return this.commonService.get<AppResponse<AppointmentWithSOAPNotesDto>>(
      `Appointment/GetAppointmentWithSOAPNotes/${appoinmentId}`
    );
  }

  UpdateAppointment$(
    payload: UpdateAppointmentDto
  ): Observable<AppResponse<null>> {
    return this.commonService.post<AppResponse<null>>(
      `Appointment/UpdateAppoinmentDto`,
      payload
    );
  }
}
