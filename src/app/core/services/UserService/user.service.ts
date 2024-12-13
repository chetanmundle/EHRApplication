import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterPatientDto } from '../../Models/Interfaces/User/patient.model';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import { RegisterProvidertDto } from '../../Models/Interfaces/User/provider.model';
import {
  LoginUserDto,
  LoginUserResponseDto,
  LoginUserValidateOtpDto,
} from '../../Models/Interfaces/User/UserDto.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private Url = 'https://localhost:7035/api/User';

  RegisterPatient$(payload: RegisterPatientDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/RegisterPatient`,
      payload
    );
  }

  RegisterProvider$(
    payload: RegisterProvidertDto
  ): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/RegisterProvider`,
      payload
    );
  }

  LoginUser$(payload: LoginUserDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(`${this.Url}/LoginUser`, payload);
  }

  VerifyOtpAndGetJwtToken$(
    payload: LoginUserValidateOtpDto
  ): Observable<AppResponse<LoginUserResponseDto>> {
    return this.http.post<AppResponse<LoginUserResponseDto>>(
      `${this.Url}/LoginUserValidateOtp`,
      payload
    );
  }
}
