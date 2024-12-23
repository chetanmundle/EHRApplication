import { AsyncPipe } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/services/index';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterContentChecked {
  title = 'EHRApplicationFrontend';

  loadingService = inject(LoaderService);

  constructor(private cdref: ChangeDetectorRef) {}
  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }
}
