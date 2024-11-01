import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GetAirport } from '../../../_models/Airport/get-airport';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AirportService } from '../../../_services/airport.service';
import { TerminalService } from '../../../_services/terminal.service';
import { GetTerminal } from '../../../_models/terminal/get-terminal';
import { PutTerminal } from '../../../_models/terminal/put-terminal';

@Component({
  selector: 'app-update-terminal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './update-terminal.component.html',
  styleUrl: './update-terminal.component.css',
})
export class UpdateTerminalComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly terminalService = inject(TerminalService);
  private readonly airportService = inject(AirportService);
  private subscriptions: Subscription | null = null;
  terminalForm!: FormGroup;
  terminal: GetTerminal | null = null;
  airports: GetAirport[] = [];
  formErrors: string[] = [];

  ngOnInit(): void {
    this.terminalForm = new FormGroup({
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      airportId: new FormControl<string>('', [Validators.required]),
    });

    this.fetchAirports();
    this.fetchSelectedTerminal();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  updateTerminal() {
    this.formErrors = [];
    if (this.terminalForm.status !== 'VALID') return this.generateErrors();

    const postData = this.generatePutObject();
    this.terminalService.updateTerminal(this.terminal!.id, postData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/terminals?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  private fetchAirports() {
    this.airportService.getAirports(1, 1000).subscribe({
      next: (res) => (this.airports = res.data),
    });
  }

  private fetchSelectedTerminal() {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        const terminalId: number = +params['id'];
        this.terminalService.getTerminalById(terminalId).subscribe({
          next: (res) => {
            this.terminal = res;
            this.updateForm();
          },
          error: (err) => {
            this.router.navigateByUrl('dashboard/terminals');
          },
        });
      },
      error: (err) => {
        this.router.navigateByUrl('dashboard/terminals');
      },
    });
  }
  private generateErrors() {
    var fields: string[] = ['name', 'airportId'];
    fields.forEach((field) => {
      const fieldErrors = this.terminalForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      } else if (fieldErrors && fieldErrors['minlength']) {
        this.formErrors.push(
          `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
        );
      }
    });
  }

  private generatePutObject(): PutTerminal {
    const name: string = this.terminalForm.controls['name'].value;
    const airportId: number = +this.terminalForm.controls['airportId'].value;
    const postData = new PutTerminal(this.terminal!.id, name, airportId);
    return postData;
  }

  private updateForm() {
    this.terminalForm.controls['name'].setValue(this.terminal?.name);
    this.terminalForm.controls['airportId'].setValue(this.terminal?.airportId);
  }
}
