import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import { specialisationDto } from '../../Models/Interfaces/Specialization/specialization.model';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private Url = 'https://localhost:7035/api/Specialization';

  private http = inject(HttpClient);

  GetAllSpecialization$(): Observable<AppResponse<specialisationDto[]>> {
    return this.http.get<AppResponse<specialisationDto[]>>(
      `${this.Url}/GetAllSpecialization`
    );
  }
}
