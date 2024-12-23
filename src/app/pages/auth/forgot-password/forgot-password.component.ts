import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MyToastServiceService } from '../../../core/services/index';
import { UserService } from '../../../core/services/index';
import { Router, RouterLink } from '@angular/router';
import { OtpService } from '../../../core/services/index';
import { AppResponse } from '../../../core/Models/AppResponse';
import { ForgetPasswordDto } from '../../../core/Models/Interfaces/User/UserDto.model';
import { SubSinkService } from '../../../core/services/index';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnDestroy {
  StrongPasswordRegx: RegExp =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+;:.<>?]).{8,}$/;
  isOtpSend: boolean = false;
  passwordResetForm: FormGroup;
  private readonly subSink: SubSinkService = new SubSinkService();
  isSendRandomPassword: boolean = true;

  private otpService = inject(OtpService);
  private tostr = inject(MyToastServiceService);
  private userService = inject(UserService);
  private router = inject(Router);

  constructor(private formbuilder: FormBuilder) {
    this.passwordResetForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  // this fuction send the otp
  onClickSendOtpBtn() {
    const emailControl = this.passwordResetForm.get('email');

    if (emailControl?.invalid) {
      this.tostr.showError('Enter the Valid Email..!');
      return;
    }

    this.subSink.sink = this.otpService
      .sendOtpToEmail$(emailControl?.value)
      .subscribe({
        next: (res: AppResponse<object>) => {
          if (res.isSuccess) {
            emailControl?.disable();
            this.isOtpSend = true;

            this.tostr.showSuccess(res.message);
          } else {
            this.tostr.showError(res.message);
          }
        },
        error: (err: Error) => {
          this.tostr.showError('Unble to send otp');
        },
      });
  }

  // Change Password fuction
  onClickChangePassword() {
    if (this.passwordResetForm.invalid) {
      this.tostr.showError('Please fill all the fields..!');
      return;
    }

    const payload: ForgetPasswordDto = {
      email: this.passwordResetForm.get('email')?.value,
      otp: Number(this.passwordResetForm.get('otp')?.value),
      password: this.passwordResetForm.get('password')?.value,
      confirmPassword: this.passwordResetForm.get('confirmPassword')?.value,
    };

    const otpLength = payload.otp.toString().length;
    if (otpLength !== 8) {
      this.tostr.showError('Otp Must be 8 Digit');
      return;
    } else if (payload.password !== payload.confirmPassword) {
      this.tostr.showError('Password and Confirm Password Must be Same');
      return;
    }

    this.subSink.sink = this.userService.ForgetPassword$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.tostr.showSuccess(res.message);
          this.router.navigate(['/auth/Login']);
        } else {
          this.tostr.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.tostr.showError('Unable to Validate otp');
      },
    });
  }

  // Send Random Password in Email
  SendRandomPasswordinEmail() {
    const email = this.passwordResetForm.get('email')?.value;

    if (email) {
      this.subSink.sink = this.userService
        .SendRandomPasswordOnEmail$(email)
        .subscribe({
          next: (res: AppResponse<null>) => {
            if (res.isSuccess) {
              this.router.navigateByUrl('/auth/Login');
              this.tostr.showSuccess(res.message);
            } else {
              this.tostr.showError(res.message);
            }
          },
          error: (err: Error) => {
            console.log('Error to forget Password : ', err);
            this.tostr.showError('Server Error...!');
          },
        });
    } else {
      this.tostr.showError('Enter The Email...!');
    }
  }
}
