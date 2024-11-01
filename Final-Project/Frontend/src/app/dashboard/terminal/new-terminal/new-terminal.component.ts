import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TerminalService } from '../../../_services/terminal.service';
import { AirportService } from '../../../_services/airport.service';
import { Subscription } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GetAirport } from '../../../_models/Airport/get-airport';
import { PostTerminal } from '../../../_models/terminal/post-terminal';

@Component({
  selector: 'app-new-terminal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-terminal.component.html',
  styleUrl: './new-terminal.component.css',
})
export class NewTerminalComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly terminalService = inject(TerminalService);
  private readonly airportService = inject(AirportService);
  private subscriptions: Subscription | null = null;
  TerminalForm!: FormGroup;
  airports: GetAirport[] = [];
  formErrors: string[] = [];

  ngOnInit(): void {
    this.TerminalForm = new FormGroup({
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      airportId: new FormControl<string>('', [Validators.required]),
    });

    this.fetchairports();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  addTerminal() {
    this.formErrors = [];
    if (this.TerminalForm.status !== 'VALID') return this.generateErrors();

    const postData = this.generatePostObject();
    this.terminalService.addNewTerminal(postData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/terminals?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  private fetchairports() {
    this.airportService.getAirports(1, 1000).subscribe({
      next: (res) => (this.airports = res.data),
    });
  }

  private generateErrors() {
    var fields: string[] = ['name', 'airportId'];
    fields.forEach((field) => {
      const fieldErrors = this.TerminalForm.controls[field].errors;
      if (fieldErrors && fieldErrors['required']) {
        this.formErrors.push(`${field} is required`);
      } else if (fieldErrors && fieldErrors['minlength']) {
        this.formErrors.push(
          `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
        );
      }
    });
  }

  private generatePostObject(): PostTerminal {
    const name: string = this.TerminalForm.controls['name'].value;
    const airportId: number = +this.TerminalForm.controls['airportId'].value;
    const postData = new PostTerminal(name, airportId);
    return postData;
  }
}
