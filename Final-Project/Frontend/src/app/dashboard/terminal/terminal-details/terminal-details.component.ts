import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TerminalService } from '../../../_services/terminal.service';
import { GetTerminal } from '../../../_models/terminal/get-terminal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terminal-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terminal-details.component.html',
  styleUrl: './terminal-details.component.css',
})
export class TerminalDetailsComponent implements OnInit, OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airportService = inject(TerminalService);
  terminalId: number | null = null;
  terminal: GetTerminal | null = null;
  private subscriptions: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.terminalId = +params['id'];
        this.airportService.getTerminalById(this.terminalId).subscribe({
          next: (res) => {
            this.terminal = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
          },
        });
      },
    });
  }
}
