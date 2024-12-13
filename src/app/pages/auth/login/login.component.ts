import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/UserService/user.service';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { Router, RouterLink } from '@angular/router';
import { LoginUserDto } from '../../../core/Models/Interfaces/User/UserDto.model';
import { AppResponse } from '../../../core/Models/AppResponse';
import { CommonModule } from '@angular/common';
import { OtpComponent } from '../../../shared/components/otp/otp.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OtpComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword: boolean = false;
  isLoader: boolean = false;
  loginForm: FormGroup;
  isOtpBoxOpen: boolean = false;
  isSubmitClick: boolean = false;
  private subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);
  private router = inject(Router);
  private tostr = inject(MyToastServiceService);

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // fuction will call when form is submitted
  onClickLogIn() {
    this.isSubmitClick = true;
    if (this.loginForm.invalid) {
      return; // form is invalid
    }
    this.isLoader = true;
    const payload: LoginUserDto = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    console.log('Login data : ', payload);

    const sub = this.userService.LoginUser$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.isLoader = false;
          this.isOtpBoxOpen = true;
        } else {
          this.isLoader = false;
          console.log('Error to login : ', res);
          this.tostr.showError(res.message);
        }
      },
      error: (error: Error) => {
        this.isLoader = false;
        console.log('Loging Failed : ', error);
        this.tostr.showError(error.message);
      },
    });
    this.subscriptions.add(sub);
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
}
