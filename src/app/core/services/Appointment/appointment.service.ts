import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BookAppointmentDto,
  PayAndBookAppointmentDto,
} from '../../Models/Interfaces/Appointment/appointment.model';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private Url = 'https://localhost:7035/api/Appointment';

  // Book ApointmentBy Patient
  BookAppointmentByPatient$(
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
}
