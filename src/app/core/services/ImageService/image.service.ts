import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AppResponse } from '../../Models/AppResponse';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private Url = 'https://localhost:7035/api/Image';
  private http = inject(HttpClient);

  // This service save the Image in Database
  uploadImage$(file: File): Observable<AppResponse<string>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.Url}/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: this.getNoShowHeaders(),
    });

    return this.http.request<HttpEvent<AppResponse<string>>>(req).pipe(
      filter((event) => event.type === HttpEventType.Response),
      map((event) => event.body as unknown as AppResponse<string>)
    );
  }

  private getNoShowHeaders() {
    return new HttpHeaders().set('X-No-Loader', 'true');
  }
}
