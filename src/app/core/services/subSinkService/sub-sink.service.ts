import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubSinkService {
  private readonly subscriptions: Subscription[] = [];

  set sink(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  unsubscribe() {
    while (this.subscriptions.length > 0) {
      let subscription = this.subscriptions.pop();
      subscription?.unsubscribe();
    }
  }
}
