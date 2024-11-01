import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LocationService } from '../../../_services/location.service';
import { AirportService } from '../../../_services/airport.service';
import { Router, RouterLink } from '@angular/router';
import { GetLocation } from '../../../_models/Location/get-location';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostAirport } from '../../../_models/Airport/post-airport';

@Component({
  selector: 'app-new-airport',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-airport.component.html',
  styleUrl: './new-airport.component.css',
})
export class NewAirportComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly locationService = inject(LocationService);
  private readonly airportService = inject(AirportService);
  private subscriptions: Subscription | null = null;
  airportForm!: FormGroup;
  locations: GetLocation[] = [];
  formErrors: string[] = [];

  ngOnInit(): void {
    this.airportForm = new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      locationId: new FormControl<string>('', [Validators.required]),
    });

    this.fetchLocations();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  addAirport() {
    this.formErrors = [];
    if (this.airportForm.status !== 'VALID') return this.generateErrors();

    const postData = this.generatePostObject();
    this.airportService.addNewAirport(postData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/airports?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  private fetchLocations() {
    this.locationService.getLocations().subscribe({
      next: (res) => (this.locations = res),
    });
  }

  private generateErrors() {
    var fields: string[] = ['code', 'name', 'locationId'];
    fields.forEach((field) => {
      const fieldErrors = this.airportForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      } else if (fieldErrors && fieldErrors['minlength']) {
        this.formErrors.push(
          `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
        );
      }
    });
  }

  private generatePostObject(): PostAirport {
    const code: string = this.airportForm.controls['code'].value;
    const name: string = this.airportForm.controls['name'].value;
    const locationId: number = +this.airportForm.controls['locationId'].value;
    const postData = new PostAirport(name, code, locationId);
    return postData;
  }
}
