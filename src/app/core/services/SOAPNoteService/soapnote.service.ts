import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSOAPNoteDto } from '../../Models/Interfaces/SOAPNotes/SOAPNotes.model';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';
import { CommonService } from '../commonService/common-service.service';

@Injectable({
  providedIn: 'root',
})
export class SOAPNoteService {
  private commonService = inject(CommonService);

  SaveSOAPNotes$(payload: CreateSOAPNoteDto): Observable<AppResponse<null>> {
    return this.commonService.post<AppResponse<null>>(
      `SOAPNotes/SaveSOAPNotes`,
      payload
    );
  }
}
