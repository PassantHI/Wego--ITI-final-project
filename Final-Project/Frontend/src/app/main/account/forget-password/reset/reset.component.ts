import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../_services/auth.service';
import { AirlineDetailsComponent } from '../../../../dashboard/Airline/airline-detials/airline-details.component';
import { FooterComponent } from '../../../../core/footer/footer.component';
import { NavbarComponent } from '../../../../core/navbar/navbar.component';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AirlineDetailsComponent,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css',
})
export class ResetComponent {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  service = inject(AuthService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);

  form!: FormGroup;
  isSubmited = false;
  token: string = '';
  userId: string = '';

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
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.userId = this.route.snapshot.queryParamMap.get('userId') || '';

    this.form = this.formBuilder.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  onSubmit() {
    this.isSubmited = true;
    if (this.form.valid) {
      const resetDto = {
        userId: this.userId,
        token: this.token,
        password: this.form.value.newPassword,
      };
      this.service.resetPassword(resetDto).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message);
          this.router.navigateByUrl('/account/login');
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      console.log('form invalid');
    }
  }
  hasDisplayMessage(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmited || Boolean(control?.touched))
    );
  }
}
