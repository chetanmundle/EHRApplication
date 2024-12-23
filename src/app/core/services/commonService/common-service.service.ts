import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private readonly _http = inject(HttpClient);
  api_url = 'https://localhost:7035/api';

  private getNoShowHeaders() {
    return new HttpHeaders().set('X-No-Loader', 'true');
  }
  /** Generic Http post request */
  post<T>(url: string, body: any, isShowLoader: boolean = true): Observable<T> {
    const fullUrl = `${this.api_url}/${url}`;

    if (!isShowLoader) {
      return this._http.post<T>(fullUrl, body, {
        headers: this.getNoShowHeaders(),
      });
    }

    return this._http.post<T>(fullUrl, body);
  }

  /** Generic Http Get request */
  get<T>(url: string, isShowLoader: boolean = true): Observable<T> {
    const fullUrl = `${this.api_url}/${url}`;

    if (!isShowLoader) {
      return this._http.get<T>(fullUrl, { headers: this.getNoShowHeaders() });
    }

    return this._http.get<T>(fullUrl);
  }

  /** Generic Http delete request */
  delete<T>(url: string, isShowLoader: boolean = true): Observable<T> {
    const fullUrl = `${this.api_url}/${url}`;

    if (!isShowLoader) {
      return this._http.delete<T>(fullUrl, {
        headers: this.getNoShowHeaders(),
      });
    }

    return this._http.delete<T>(fullUrl);
  }

  /** Generic Http put request */
  put<T>(url: string, body: any, isShowLoader: boolean = true): Observable<T> {
    const fullUrl = `${this.api_url}/${url}`;

    if (!isShowLoader) {
      return this._http.put<T>(fullUrl, body, {
        headers: this.getNoShowHeaders(),
      });
    }

    return this._http.put<T>(fullUrl, body);
  }
}
