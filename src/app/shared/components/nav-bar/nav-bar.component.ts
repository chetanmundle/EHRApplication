import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SubSinkService, UserService } from '../../../core/services/index';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoggedUserDto } from '../../../core/Models/classes/User/LoggedUserDto';
import { useAuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnDestroy, OnInit {
  loggedUser?: LoggedUserDto;
  private readonly subSink: SubSinkService = new SubSinkService();
  currentUrl: string = '';

  private userService = inject(UserService);
  authStore = inject(useAuthStore);
  private router = inject(Router);

  constructor() {
    // subscribe for which user is currently logged in
    this.subSink.sink = this.userService.loggedUser$.subscribe({
      next: (user: LoggedUserDto) => {
        this.loggedUser = user;
      },
    });
  }
  ngOnInit(): void {
    this.currentUrl = this.router.url;
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
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
    this.authStore.logout();
    this.router.navigateByUrl('/auth/Login');
  }
}
