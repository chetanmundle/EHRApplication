import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/UserService/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoggedUserDto } from '../../../core/Models/classes/User/LoggedUserDto';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnDestroy, OnInit {
  loggedUser?: LoggedUserDto;
  subscriptions: Subscription = new Subscription();
  cartItemCount: number = 0;
  searchWord: string = '';

  private userService = inject(UserService);

  private router = inject(Router);

  constructor() {
    // subscribe for which user is currently logged in
    const sub = this.userService.loggedUser$.subscribe({
      next: (user: LoggedUserDto) => {
        this.loggedUser = user;
      },
    });

    this.subscriptions.add(sub);
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onClickLogOut() {
    localStorage.removeItem('accessToken');
    this.userService.resetLoggedUser();
    this.router.navigateByUrl('/auth/Login');
  }
}
