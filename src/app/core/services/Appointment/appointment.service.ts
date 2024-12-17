import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private Url = 'https://localhost:7035/api/Appointment';

  // Book ApointmentBy
  BookAppointmentByProvider$(
    payload: BookAppointmentDto
  ): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/BookAppointment`,
      payload
    );
  }
  // Book ApointmentBy Patient
  PayAndBookAppointmentByPatient$(
    payload: PayAndBookAppointmentDto
  ): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/PaymentBookAppointment`,
      payload
    );
  }

  // Get patient apoinments by theire id
  GetAppointmentByPatientId$(
    patientId: number,
    status: string
  ): Observable<AppResponse<GetAppoinmentByPatientIdDto[]>> {
    return this.http.get<AppResponse<GetAppoinmentByPatientIdDto[]>>(
      `${this.Url}/GetAppoinmentsByPatientId/${patientId}/${status}`
    );
  }

  // Get Providers Appointment which is booked by custoemer
  GetAppointmentByProviderId$(
    providerId: number,
    status: string
  ): Observable<AppResponse<GetAppoinmentByProviderIdDto[]>> {
    return this.http.get<AppResponse<GetAppoinmentByProviderIdDto[]>>(
      `${this.Url}/GetAppoinmentsByProvidertId/${providerId}/${status}`
    );
  }

  CancelAppointmentByApptId$(
    appointmentId: number
  ): Observable<AppResponse<null>> {
    return this.http.delete<AppResponse<null>>(
      `${this.Url}/CancelAppointmentById/${appointmentId}`
    );
  }

  GetAppointmentWithSOAPNotes$(
    appoinmentId: number
  ): Observable<AppResponse<AppointmentWithSOAPNotesDto>> {
    return this.http.get<AppResponse<AppointmentWithSOAPNotesDto>>(
      `${this.Url}/GetAppointmentWithSOAPNotes/${appoinmentId}`
    );
  }

  UpdateAppointment$(
    payload: UpdateAppointmentDto
  ): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/UpdateAppoinmentDto`,
      payload
    );
  }
}
