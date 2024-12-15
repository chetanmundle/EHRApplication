import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private http = inject(HttpClient);
  private Url = 'https://localhost:7035/api/Otp';

  sendOtpToEmail$(email: string): Observable<AppResponse<any>> {
    return this.http.get<AppResponse<any>>(`${this.Url}/SendOtp/${email}`);
  }
}
