import { Component, OnDestroy } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SubSinkService } from '../../../core/services/index';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnDestroy {
  work: string = 'Login';

  currentUrl?: string;
  private readonly subSink: SubSinkService = new SubSinkService();

  constructor(private router: Router) {
    // Get Current Url
    const sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl = this.router.url;
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
