import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TerminalService } from '../../../_services/terminal.service';
import { GetTerminal } from '../../../_models/terminal/get-terminal';

@Component({
  selector: 'app-delete-terminal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-terminal.component.html',
  styleUrl: './delete-terminal.component.css',
})
export class DeleteTerminalComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly terminalService = inject(TerminalService);
  internalError: string | null = null;
  terminalId: number | null = null;
  terminal: GetTerminal | null = null;
  private subscriptions: Subscription | null = null;

  delete() {
    if (!this.terminalId || !this.terminal) return;

    this.terminalService.deleteTerminal(this.terminalId).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard/terminals?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.terminalId = +params['id'];
        this.terminalService.getTerminalById(this.terminalId).subscribe({
          next: (res) => {
            this.terminal = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
            this.router.navigateByUrl('/dashboard/terminals');
          },
        });
      },
    });
  }
}
