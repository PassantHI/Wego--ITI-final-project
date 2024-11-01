import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  service = inject(AuthService);
  toastr = inject(ToastrService);

  form!: FormGroup;
  isSubmited = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (
      newPassword &&
      confirmPassword &&
      newPassword.value != confirmPassword.value
    )
      confirmPassword?.setErrors({ passwordMismatch: true });
    else confirmPassword?.setErrors(null);
    return null;
  };

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  onSubmit() {
    this.isSubmited = true;

    if (this.form.valid) {
      this.service.changePassword(this.form.value).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message);
          this.router.navigateByUrl('/account/dashboard');
        },
        error: (err) => {
          if (err.status == 400) {
            this.toastr.error('wrong email or password');
          } else console.log(err);
        },
      });
    } else console.log('form invalid');
  }

  hasDisplayMessage(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmited || Boolean(control?.touched))
    );
  }
}
