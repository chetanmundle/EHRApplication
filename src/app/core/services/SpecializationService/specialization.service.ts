import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import { specialisationDto } from '../../Models/Interfaces/Specialization/specialization.model';
import { CommonService } from '../commonService/common-service.service';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private commonService = inject(CommonService);

  GetAllSpecialization$(): Observable<AppResponse<specialisationDto[]>> {
    return this.commonService.get<AppResponse<specialisationDto[]>>(
      `Specialization/GetAllSpecialization`
    );
  }
}
