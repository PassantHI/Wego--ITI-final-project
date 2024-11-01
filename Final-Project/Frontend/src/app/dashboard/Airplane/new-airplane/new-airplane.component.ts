import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AirlineService } from '../../../_services/airline.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AirplaneService } from '../../../_services/airplane.service';
import { GetAirline } from '../../../_models/Airline/get-airline';
import { PostAirplane } from '../../../_models/airplane/post-airplane';

@Component({
  selector: 'app-new-airplane',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './new-airplane.component.html',
  styleUrl: './new-airplane.component.css',
})
export class NewAirplaneComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly airlineService = inject(AirlineService);
  private readonly airplaneService = inject(AirplaneService);
  private subscriptions: Subscription | null = null;
  airplaneForm!: FormGroup;
  features: string[] = ['meal', 'video', 'usb', 'wifi'];
  airlines: GetAirline[] = [];
  formErrors: string[] = [];

  ngOnInit(): void {
    this.airplaneForm = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      type: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      economySeats: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      firstClassSeats: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      businessSeats: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      airlineId: new FormControl<string>('', [Validators.required]),
      features: new FormArray([]),
    });

    this.fetchAirlines();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  addAirplane() {
    this.formErrors = [];
    if (this.airplaneForm.status !== 'VALID') return this.generateErrors();

    const postData = this.generatePostObject();
    this.airplaneService.addNewAirplane(postData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/airplanes?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  onCheckboxChange(event: Event) {
    const formArray = this.airplaneForm.get('features') as FormArray;
    const element = event.target as HTMLInputElement;
    if (element.checked) formArray.push(new FormControl(element.value));
    else {
      const index = formArray.controls.findIndex(
        (x) => x.value === element.value
      );
      formArray.removeAt(index);
    }
  }

  private fetchAirlines() {
    this.airlineService.getAirlines(1, 1).subscribe({
      next: (res) => {
        const total = res.total;
        this.airlineService.getAirlines(1, total).subscribe({
          next: (res) => {
            this.airlines = res.data;
          },
        });
      },
    });
  }

  private generateErrors() {
    var fields: string[] = [
      'type',
      'code',
      'airlineId',
      'economySeats',
      'firstClassSeats',
      'businessSeats',
    ];
    fields.forEach((field) => {
      const fieldErrors = this.airplaneForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      } else if (fieldErrors && fieldErrors['minlength']) {
        this.formErrors.push(
          `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
        );
      } else if (fieldErrors && fieldErrors['min']) {
        this.formErrors.push(
          `${field} must be ${fieldErrors['min']['min']} or more`
        );
      }
    });
  }

  private generatePostObject(): PostAirplane {
    const code: string = this.airplaneForm.controls['code'].value;
    const type: string = this.airplaneForm.controls['type'].value;
    const airlineId: number = +this.airplaneForm.controls['airlineId'].value;
    const firstClassSeats: number =
      +this.airplaneForm.controls['firstClassSeats'].value;
    const businessSeats: number =
      +this.airplaneForm.controls['businessSeats'].value;
    const economySeats: number =
      +this.airplaneForm.controls['economySeats'].value;
    const featureNames: string[] = this.airplaneForm.controls['features'].value;
    const postData = new PostAirplane(
      code,
      type,
      airlineId,
      featureNames,
      economySeats,
      firstClassSeats,
      businessSeats
    );
    return postData;
  }
}
