import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { GetAirport } from '../../../../_models/Airport/get-airport';
import { AirportService } from '../../../../_services/airport.service';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../../_services/flight.service';

@Component({
  selector: 'app-filter-search-from',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    BsDropdownModule,
  ],
  templateUrl: './filter-search-from.component.html',
  styleUrl: './filter-search-from.component.css',
})
export class FilterSearchFromComponent implements OnInit, OnDestroy {
  flightType: string = 'one'; // one or round
  seatClass: string = 'Economy'; // First Class or Economy or Business
  numberOfSeats: number = 1;
  todayDate: string;
  searchForm!: FormGroup;
  private allAirports: GetAirport[] = [];
  fromAirports: GetAirport[] = [];
  toAirports: GetAirport[] = [];
  departAirport: GetAirport | null = null;
  arrivalAirport: GetAirport | null = null;
  sortBy: string = 'price';
  minPrice: string = 'price';
  maxPrice: string = 'price';
  minDuration: string = 'price';
  maxDuration: string = 'price';
  flightTime: string = 'price';
  private readonly airportService = inject(AirportService);
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private subs: Subscription | null = null;
  formError: string | null = null;

  constructor() {
    const today = new Date();
    const offsetInHours = today.getTimezoneOffset() / 60;
    today.setHours(today.getHours() - offsetInHours);
    this.todayDate = today.toISOString().split('T')[0];
  }
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  setAirport(id: number, target: 'depart' | 'arrival') {
    if (id === 0) return;
    const airport = this.allAirports.find((a) => a.id === id);
    if (!airport) return;

    const airportField =
      target === 'depart' ? 'departAirport' : 'arrivalAirport';
    this[airportField] = airport;

    this.searchForm
      .get(airportField)
      ?.setValue(`${airport.city},${airport.country} (${airport.code})`);
    this.fromAirports = this.toAirports = [];
  }

  updateAirports(
    target: 'departAirport' | 'arrivalAirport',
    airportList: 'fromAirports' | 'toAirports'
  ) {
    const searchString: string = this.searchForm.get(target)?.value ?? '';
    if (searchString.length <= 0) {
      this[airportList] = [];
      return;
    }
    this[airportList] = this.allAirports?.filter(
      (a) =>
        a.name.toLowerCase().includes(searchString.toLowerCase()) ||
        a.city.toLowerCase().includes(searchString.toLowerCase()) ||
        a.country.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  ngOnInit() {
    this.searchForm = new FormGroup(
      {
        departAirport: new FormControl<string>('', [Validators.required]),
        arrivalAirport: new FormControl<string>('', [Validators.required]),
        departDate: new FormControl<Date | null>(null, [
          Validators.required,
          this.validDate,
        ]),
        returnDate: new FormControl<Date | null>(null, [this.validDate]),
      },
      { validators: this.datesValidator }
    );

    this.subs = this.activeRoute.queryParams.subscribe({
      next: (params) => {
        const departAirportId: number | undefined = params['departAirportId'];
        const arrivalAirportId: number | undefined = params['arrivalAirportId'];
        const seatClass: number | undefined = params['class'];
        const departDate: string | undefined = params['departDate'];
        const returnDate: string | undefined = params['returnDate'];
        const flightType: string | undefined = params['type'];
        const seats: number | undefined = params['seats'];
        const sortBy: string | undefined = params['sortBy'];
        const minPrice: string | undefined = params['minPrice'];
        const maxPrice: string | undefined = params['MaxxPrice'];
        const minDuration: string | undefined = params['minDuration'];
        const maxDuration: string | undefined = params['maxDuration'];
        const flightTime: string | undefined = params['flightTime'];
        this.flightType = flightType ?? this.flightType;
        this.numberOfSeats = Number(seats) ?? this.numberOfSeats;
        let seatClasName: string;
        switch (Number(seatClass)) {
          case 1:
            seatClasName = 'Business';
            break;
          case 2:
            seatClasName = 'First Class';
            break;
          default:
            seatClasName = 'Economy';
            break;
        }

        this.seatClass = seatClasName;
        if (departDate) {
          this.searchForm.controls['departDate'].setValue(
            new Date(departDate.trim()).toISOString().split('T')[0]
          );
        }
        if (flightType === 'round' && returnDate)
          this.searchForm.controls['returnDate'].setValue(
            new Date(returnDate.trim()).toISOString().split('T')[0]
          );

        this.airportService.getAirports(1, 1).subscribe({
          next: (res) => {
            const pageSize = res.total;
            this.airportService.getAirports(1, pageSize).subscribe({
              next: (res) => {
                this.allAirports = res.data;
                if (departAirportId && Number(departAirportId))
                  this.departAirport =
                    this.allAirports.find((a) => a.id === +departAirportId) ??
                    null;
                this.searchForm.controls['departAirport'].setValue(
                  `${this.departAirport?.city},${this.departAirport?.country} (${this.departAirport?.code})`
                );
                if (arrivalAirportId && Number(arrivalAirportId))
                  this.arrivalAirport =
                    this.allAirports.find((a) => a.id === +arrivalAirportId) ??
                    null;
                this.searchForm.controls['arrivalAirport'].setValue(
                  `${this.arrivalAirport?.city},${this.arrivalAirport?.country} (${this.arrivalAirport?.code})`
                );
              },
            });
          },
        });
        this.sortBy = sortBy ?? this.sortBy;
        this.minPrice = sortBy ?? this.minDuration;
        this.maxPrice = sortBy ?? this.maxPrice;
        this.minDuration = sortBy ?? this.minDuration;
        this.maxDuration = sortBy ?? this.maxDuration;
        this.flightTime = sortBy ?? this.flightTime;
      },
      error: () => {},
    });
  }

  datesValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const departDate: Date | null = group.get('departDate')?.value;
    const returnDate: Date | null = group.get('returnDate')?.value;

    const validDates =
      (this.flightType == 'one' && departDate) ||
      (this.flightType == 'round' &&
        returnDate &&
        departDate &&
        returnDate >= departDate);
    return !validDates ? { invalidDate: { value: false } } : null;
  };

  validDate: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value: Date | null = control.value;
    let date: Date;
    if (value) {
      date = new Date(value);
      date.setHours(0, 0, 0, 0);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validDate = (value && date!.getTime() >= today.getTime()) || !value;
    return !validDate
      ? {
          invalidDate: {
            value: false,
          },
        }
      : null;
  };

  getFlights() {
    if (!this.arrivalAirport || !this.departAirport) {
      this.formError = 'You must select Airports From dropdown menu';
      this.flightService.isFormError = true;
      return;
    }
    if (this.searchForm.status == 'INVALID') {
      this.flightService.isFormError = true;
      this.formError = 'Invalid Date/s';
      return;
    }
    if (this.departAirport?.id == this.arrivalAirport?.id) {
      this.flightService.isFormError = true;
      this.formError = 'Arrival Airport Cant be the same as Depart Airport';
      return;
    }
    this.flightService.isFormError = false;
    this.formError = null;

    const departAirportId: number | undefined = this.departAirport?.id;
    const arrivalAirportId: number | undefined = this.arrivalAirport?.id;
    let departDate: Date | undefined =
      this.searchForm.controls['departDate'].value;
    let returnDate: Date | undefined =
      this.searchForm.controls['returnDate'].value;
    const noOfSeats: number = this.numberOfSeats;

    let seatClass: number;
    switch (
      this.seatClass.toLowerCase() // 'Economy'; // First Class or Economy or Business
    ) {
      case 'business':
        seatClass = 1;
        break;
      case 'first class':
        seatClass = 2;
        break;
      default:
        seatClass = 0;
        break;
    }

    if (
      !departAirportId ||
      !arrivalAirportId ||
      !(seatClass >= 0 && seatClass <= 2) ||
      !departDate
    )
      return;
    if (this.flightType == 'round' && !returnDate) return;
    if (returnDate) returnDate = new Date(returnDate);
    departDate = new Date(departDate);
    // departDate.setHours(0, 0, 0, 0);
    // returnDate?.setHours(0, 0, 0, 0);
    const queryLink = `type=${
      this.flightType
    }&class=${seatClass}&seats=${noOfSeats}&departDate=${departDate.toISOString()}${
      returnDate ? '&returnDate=' + returnDate.toISOString() : ''
    }&departAirportId=${departAirportId}&arrivalAirportId=${arrivalAirportId}&sortBy=${
      this.sortBy
    }&minPrice=${this.minPrice}&maxPrice=${this.maxPrice}&minDuration=${
      this.minDuration
    }&maxDuration=${this.maxDuration}&flightTime=${this.flightTime}`;
    this.router.navigateByUrl(`/flights/search?${queryLink}`);
  }
}
