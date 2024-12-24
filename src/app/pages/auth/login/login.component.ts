import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../core/services/index';
import { MyToastServiceService } from '../../../core/services/index';
import { Router, RouterLink } from '@angular/router';
import { LoginUserDto } from '../../../core/Models/Interfaces/User/UserDto.model';
import { AppResponse } from '../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { OtpComponent } from '../../../shared/components/otp/otp.component';
import { useAuthStore } from '../../../core/stores/auth.store';
import { SubSinkService } from '../../../core/services/index';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OtpComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword: boolean = false;
  loginForm: FormGroup;
  isOtpBoxOpen: boolean = false;
  isSubmitClick: boolean = false;
  private readonly subSink: SubSinkService = new SubSinkService();

  private userService = inject(UserService);
  private router = inject(Router);
  private tostr = inject(MyToastServiceService);
  private authStore = inject(useAuthStore);

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  // fuction will call when form is submitted
  onClickLogIn() {
    this.isSubmitClick = true;
    if (this.loginForm.invalid) {
      return; // form is invalid
    }

    const payload: LoginUserDto = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.subSink.sink = this.userService.LoginUser$(payload).subscribe({
      next: (res: AppResponse<string>) => {
        if (res.isSuccess) {
          this.FirebaseGetLogin(res.data, 'Pass@123');
          this.isOtpBoxOpen = true;
        } else {
          console.log('Error to login : ', res);
          this.tostr.showError(res.message);
        }
      },
      error: (error: Error) => {
        console.log('Loging Failed : ', error);
        this.tostr.showError(error.message);
      },
    });
  }

  onClickShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getEmail(): string {
    return this.loginForm.get('email')?.value;
  }

  onCancelBtnClick(value: boolean) {
    this.isOtpBoxOpen = value;
  }

  async FirebaseGetLogin(email: string, password: string) {
    try {
      await this.authStore.login(email, password);
      // this.router.navigate(['/chat']);
      // Navigate to chat list after successful login
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        console.log('Error logi ', error.message);

        // this.errorMessage.set(error.message);
      } else {
        console.log("'An unexpected error occurred. Please try again.'");

        // this.errorMessage.set(
        //   'An unexpected error occurred. Please try again.'
        // );
      }
    }
  }
}
