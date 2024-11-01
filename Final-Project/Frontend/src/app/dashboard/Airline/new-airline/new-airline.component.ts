import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AirlineService } from '../../../_services/airline.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-airline',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './new-airline.component.html',
  styleUrl: './new-airline.component.css',
})
export class NewAirlineComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly airlineService = inject(AirlineService);
  private subscriptions: Subscription | null = null;
  public imageFile: File | null = null;
  airlineForm!: FormGroup;
  formErrors: string[] = [];

  ngOnInit(): void {
    this.airlineForm = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      image: new FormControl<File | null>(null, [Validators.required]),
    });
  }
  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  updateImageFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.imageFile = target.files[0];
    }
  }

  addAirline() {
    this.formErrors = [];
    if (this.airlineForm.status !== 'VALID') {
      var fields: string[] = ['name', 'code', 'image'];

      fields.forEach((field) => {
        const fieldErrors = this.airlineForm.controls[field].errors;
        if (fieldErrors && fieldErrors['required']) {
          this.formErrors.push(`${field} is required`);
        } else if (fieldErrors && fieldErrors['minlength']) {
          this.formErrors.push(
            `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
          );
        }
      });
      return;
    }
    const code: string = this.airlineForm.controls['code'].value;
    const name: string = this.airlineForm.controls['name'].value;

    const formData: FormData = new FormData();
    formData.append('code', code);
    formData.append('name', name);
    formData.append('image', this.imageFile as File);

    this.airlineService.addNewAirline(formData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/airlines?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }
}
