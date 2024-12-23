import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import { CountryDto } from '../../Models/Interfaces/countryState/CountryDto';
import { StateDto } from '../../Models/Interfaces/countryState/StateDto';
import { CommonService } from '../commonService/common-service.service';

@Injectable({
  providedIn: 'root',
})
export class CountryStateService {
  //   private Url = 'https://localhost:7035/api/CountryState';

  //   private http = inject(HttpClient);
  private commonService = inject(CommonService);

  // Get All Countries
  GetAllCountries$(): Observable<AppResponse<CountryDto[]>> {
    return this.commonService.get<AppResponse<CountryDto[]>>(
      `CountryState/GetAllCountries`
    );
  }

  // Get all State by using Country Id
  GetAllStateByCountryId$(
    countryId: number
  ): Observable<AppResponse<StateDto[]>> {
    return this.commonService.get<AppResponse<StateDto[]>>(
      `CountryState/GetAllStatesByCountryId/${countryId}`
    );
  }
}
