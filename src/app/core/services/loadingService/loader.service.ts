import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  isLoading$ = this.isLoading.asObservable();

  showLoading() {
    this.isLoading.next(true);
  }

  HideLoading() {
    this.isLoading.next(false);
  }
}
