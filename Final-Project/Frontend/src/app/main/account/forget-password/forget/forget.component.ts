import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../_services/auth.service';
import { NavbarComponent } from '../../../../core/navbar/navbar.component';
import { FooterComponent } from '../../../../core/footer/footer.component';

@Component({
  selector: 'app-forget',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.css',
})
export class ForgetComponent {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  service = inject(AuthService);
  toastr = inject(ToastrService);

  form!: FormGroup;
  isSubmited = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.isSubmited = true;

    if (this.form.valid) {
      this.service.forgetPassword(this.form.value).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message);
        },
        error: (err) => {
          if (err.status == 400) {
            this.toastr.error('wrong email');
          } else console.log(err);
        },
      });
    } else console.log('form in valid');
  }

  hasDisplayMessage(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmited || Boolean(control?.touched))
    );
  }
}
