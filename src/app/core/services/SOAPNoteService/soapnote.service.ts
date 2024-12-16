import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSOAPNoteDto } from '../../Models/Interfaces/SOAPNotes/SOAPNotes.model';
import { Observable } from 'rxjs';
import { AppResponse } from '../../Models/AppResponse';

@Injectable({
  providedIn: 'root',
})
export class SOAPNoteService {
  private http = inject(HttpClient);

  private Url = 'https://localhost:7035/api/SOAPNotes';

  SaveSOAPNotes$(payload: CreateSOAPNoteDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/SaveSOAPNotes`,
      payload
    );
  }
}
