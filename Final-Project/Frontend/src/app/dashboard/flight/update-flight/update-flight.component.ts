import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { LocationService } from '../../../_services/location.service';
import { AirportService } from '../../../_services/airport.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GetLocation } from '../../../_models/Location/get-location';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../_services/flight.service';
import { GetAirport } from '../../../_models/Airport/get-airport';
import { GetAirline } from '../../../_models/Airline/get-airline';
import { GetAirplane } from '../../../_models/airplane/get-airplane';
import { AirlineService } from '../../../_services/airline.service';
import { AirplaneService } from '../../../_services/airplane.service';
import { PutFlight } from '../../../_models/Flight/put-flight';
@Component({
  selector: 'app-update-flight',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './update-flight.component.html',
  styleUrl: './update-flight.component.css',
})
export class UpdateFlightComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airportService = inject(AirportService);
  private readonly airlineService = inject(AirlineService);
  private readonly airplaneService = inject(AirplaneService);
  private readonly flightService = inject(FlightService);
  private subscriptions: Subscription | null = null;
  flightForm!: FormGroup;
  formErrors: string[] = [];
  airlines: GetAirline[] = [];
  airplanes: GetAirplane[] = [];
  airports: GetAirport[] = [];
  flight: PutFlight | null = null;

  selectedDepartAirport: WritableSignal<GetAirport | null> = signal(null);
  selectedArrivaltAirport: WritableSignal<GetAirport | null> = signal(null);
  selectedAirplanes: WritableSignal<GetAirplane[] | null> = signal(null);
  selectedAirline: WritableSignal<GetAirline | null> = signal(null);

  ngOnInit(): void {
    this.flightForm = new FormGroup({
      departureTime: new FormControl<string>(this.formateDate(), [
        Validators.required,
      ]),
      arrivalTime: new FormControl<string>(this.formateDate(), [
        Validators.required,
      ]),
      status: new FormControl<number>(0, [Validators.required]),
      priceEconomyClass: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      priceBusinessClass: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      priceFirstClass: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      airlineId: new FormControl<string>('', [Validators.required]),
      airplaneId: new FormControl<string>('', [Validators.required]),
      departureAirportId: new FormControl<string>('', [Validators.required]),
      departureTerminalId: new FormControl<string>('', [Validators.required]),
      arrivalAirportId: new FormControl<string>('', [Validators.required]),
      arrivalTerminalId: new FormControl<string>('', [Validators.required]),
    });

    this.fetchAirports();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  updateFlight() {
    this.formErrors = [];
    if (this.flightForm.status !== 'VALID') return this.generateErrors();

    const putData = this.generatePutObject();
    this.flightService.updateFlight(this.flight!.id, putData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/flights?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  private fetchAirports() {
    this.airportService.getAirports(1, 200).subscribe({
      next: (res) => {
        this.airports = res.data;
        this.fetchAirlines();
      },
    });
  }
  private fetchAirlines() {
    this.airlineService.getAirlines(1, 200).subscribe({
      next: (res) => {
        this.airlines = res.data;
        this.fetchAirplanes();
      },
    });
  }
  private fetchAirplanes() {
    this.airplaneService.getAirplanes(1, 200).subscribe({
      next: (res) => {
        this.airplanes = res.data;
        this.fetchSelectedFlight();
      },
    });
  }

  private fetchSelectedFlight() {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        const flightId: number = +params['id'];
        this.flightService.getFlight(flightId).subscribe({
          next: (res) => {
            this.flight = res;
            this.updateForm();
          },
          error: (err) => {
            this.router.navigateByUrl('dashboard/flights');
          },
        });
      },
      error: (err) => {
        this.router.navigateByUrl('dashboard/flights');
      },
    });
  }

  private generateErrors() {
    var fields: string[] = [
      'departureTime',
      'arrivalTime',
      'status',
      'priceEconomyClass',
      'priceBusinessClass',
      'priceFirstClass',
      'airlineId',
      'airplaneId',
      'departureAirportId',
      'departureTerminalId',
      'arrivalAirportId',
      'arrivalTerminalId',
    ];

    fields.forEach((field) => {
      const fieldErrors = this.flightForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      }
    });
  }

  private generatePutObject(): PutFlight {
    const id: number = this.flight?.id!;
    const departureTime: Date = this.flightForm.controls['departureTime'].value;
    const arrivalTime: Date = this.flightForm.controls['arrivalTime'].value;
    const status: number = this.flightForm.controls['status'].value;
    const priceEconomyClass: number =
      this.flightForm.controls['priceEconomyClass'].value;
    const priceBusinessClass: number =
      this.flightForm.controls['priceBusinessClass'].value;
    const priceFirstClass: number =
      this.flightForm.controls['priceFirstClass'].value;
    const airlineId: number = this.flightForm.controls['airlineId'].value;
    const airplaneId: number = this.flightForm.controls['airplaneId'].value;
    const departureTerminalId: number =
      this.flightForm.controls['departureTerminalId'].value;
    const arrivalTerminalI: number =
      this.flightForm.controls['arrivalTerminalId'].value;

    const postData = new PutFlight(
      id,
      departureTime,
      arrivalTime,
      status,
      priceEconomyClass,
      priceBusinessClass,
      priceFirstClass,
      airlineId,
      airplaneId,
      departureTerminalId,
      arrivalTerminalI
    );
    return postData;
  }

  selectDepartAirport(event: any) {
    const selectedAirportId = event.target.value;
    this.flightForm.controls['departureTerminalId'].setValue('');
    this.selectedDepartAirport.set(
      this.airports.find((airport) => airport.id === +selectedAirportId) ?? null
    );
  }
  selectArrivalAirport(event: any) {
    const selectedAirportId = event.target.value;
    this.flightForm.controls['arrivalTerminalId'].setValue('');
    this.selectedArrivaltAirport.set(
      this.airports.find((airport) => airport.id === +selectedAirportId) ?? null
    );
  }
  selectAirline(event: any) {
    const selectedAirlineId = event.target.value;
    this.flightForm.controls['airplaneId'].setValue('');
    this.selectedAirplanes.set(
      this.airplanes.filter(
        (airplane) => airplane.airlineId == +selectedAirlineId
      )
    );
  }
  private updateForm() {
    if (!this.flight) return;

    this.flightForm.controls['departureTime'].setValue(
      this.formateDate(new Date(this.flight.departureTime))
    );
    this.flightForm.controls['arrivalTime'].setValue(
      this.formateDate(new Date(this.flight.arrivalTime))
    );
    this.flightForm.controls['status'].setValue(this.flight.status);
    this.flightForm.controls['priceEconomyClass'].setValue(
      this.flight.priceEconomyClass
    );
    this.flightForm.controls['priceBusinessClass'].setValue(
      this.flight.priceBusinessClass
    );
    this.flightForm.controls['priceFirstClass'].setValue(
      this.flight.priceFirstClass
    );
    this.flightForm.controls['airlineId'].setValue(
      this.flight.airlineId.toString()
    );
    this.flightForm.controls['airplaneId'].setValue(
      this.flight.airplaneId.toString()
    );
    this.flightForm.controls['departureTerminalId'].setValue(
      this.flight.departureTerminalId.toString()
    );
    this.flightForm.controls['arrivalTerminalId'].setValue(
      this.flight.arrivalTerminalId.toString()
    );

    const airline = this.airlines.find((a) => a.id == this.flight!.airlineId);
    if (airline) {
      this.selectedAirline.set(airline);
      this.selectedAirplanes.set(
        this.airplanes.filter((a) => a.airlineId == airline.id)
      );
    }

    const departAirport = this.airports.find((a) =>
      a.terminalIds.includes(this.flight!.departureTerminalId)
    );
    if (departAirport) {
      this.selectedDepartAirport.set(departAirport);

      const departAirportId = departAirport.id;
      this.flightForm.controls['departureAirportId'].setValue(
        departAirportId.toString()
      );
    }

    const arrivalAirport = this.airports.find((a) =>
      a.terminalIds.includes(this.flight!.arrivalTerminalId)
    );
    if (arrivalAirport) {
      this.selectedArrivaltAirport.set(arrivalAirport);
      const arrivalAirportId = arrivalAirport.id;
      this.flightForm.controls['arrivalAirportId'].setValue(
        arrivalAirportId.toString()
      );
    }
  }

  formateDate(date: Date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate;
  }

  isNan(data: any) {
    return isNaN(data);
  }
}
