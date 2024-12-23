import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import { CommonService } from '../commonService/common-service.service';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private commonService = inject(CommonService);
  //   private Url = 'https://localhost:7035/api/Otp';

  sendOtpToEmail$(email: string): Observable<AppResponse<any>> {
    return this.commonService.get<AppResponse<any>>(`Otp/SendOtp/${email}`);
  }
}
