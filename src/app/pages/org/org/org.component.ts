import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../../../shared/components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-org',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './org.component.html',
  styleUrl: './org.component.css',
})
export class OrgComponent {}
