import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterPatientDto } from '../../Models/Interfaces/User/patient.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import {
  RegisterProvidertDto,
  UserWithIdNameDto,
} from '../../Models/Interfaces/User/provider.model';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginUserDto,
  LoginUserResponseDto,
  LoginUserValidateOtpDto,
  UpdateUserDto,
  UserDto,
  UserNameIdDto,
} from '../../Models/Interfaces/User/UserDto.model';
import { LoggedUserDto } from '../../Models/classes/User/LoggedUserDto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private Url = 'https://localhost:7035/api/User';

  loggedUser$: BehaviorSubject<LoggedUserDto> =
    new BehaviorSubject<LoggedUserDto>(new LoggedUserDto());

  constructor() {
    this, this.getLoggedUser();
  }

  private getLoggedUser(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      // Fetch the user details from the API
      this.GetLoggedUserById$(userId).subscribe({
        next: (res: AppResponse<LoggedUserDto>) => {
          if (res.isSuccess) {
            this.loggedUser$.next(res.data); // Update BehaviorSubject with user data
          } else {
            this.loggedUser$.next(new LoggedUserDto()); // Emit empty user data if the API fails
          }
        },
        error: () => {
          this.loggedUser$.next(new LoggedUserDto()); // Handle API errors gracefully
        },
      });
    } else {
      this.loggedUser$.next(new LoggedUserDto()); // Emit empty user data if no token exists
    }
  }

  public resetLoggedUser(): void {
    this.getLoggedUser();
  }

  GetLoggedUserById$(userId: number): Observable<AppResponse<LoggedUserDto>> {
    return this.http.get<AppResponse<LoggedUserDto>>(
      `${this.Url}/GetLoggedUser/${userId}`
    );
  }

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

  LoginUser$(payload: LoginUserDto): Observable<AppResponse<string>> {
    return this.http.post<AppResponse<string>>(
      `${this.Url}/LoginUser`,
      payload
    );
  }

  VerifyOtpAndGetJwtToken$(
    payload: LoginUserValidateOtpDto
  ): Observable<AppResponse<LoginUserResponseDto>> {
    return this.http.post<AppResponse<LoginUserResponseDto>>(
      `${this.Url}/LoginUserValidateOtp`,
      payload
    );
  }

  // Forget Password
  ForgetPassword$(payload: ForgetPasswordDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/ForgetPassword`,
      payload
    );
  }

  // forgot Pass (send Random PAssword in Email)
  SendRandomPasswordOnEmail$(email: string): Observable<AppResponse<null>> {
    return this.http.get<AppResponse<null>>(
      `${this.Url}/ForgotPasswordWithRandomString/${email}`
    );
  }

  // this is for get provider by specialization id is give 0 then all
  GetProvidersBySpecializationId$(
    specializationId: number
  ): Observable<AppResponse<UserWithIdNameDto[]>> {
    return this.http.get<AppResponse<UserWithIdNameDto[]>>(
      `${this.Url}/GetProvidersBySpecializationId/${specializationId}`
    );
  }

  GetAllPatientNameId$(): Observable<AppResponse<UserNameIdDto[]>> {
    return this.http.get<AppResponse<UserNameIdDto[]>>(
      `${this.Url}/GetAllPatientNameId`
    );
  }

  //Change Password
  ChangePassword$(payload: ChangePasswordDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/ChangePassword`,
      payload
    );
  }

  GetUserByUserId$(userId: number): Observable<AppResponse<UserDto>> {
    return this.http.get<AppResponse<UserDto>>(
      `${this.Url}/GetUserByUserId?userId=${userId}`
    );
  }

  UpdateUser$(payload: UpdateUserDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(`${this.Url}/UpdateUser`, payload);
  }
}
