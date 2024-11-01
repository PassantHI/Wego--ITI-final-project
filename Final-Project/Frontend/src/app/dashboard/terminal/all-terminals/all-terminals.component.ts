import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TerminalService } from '../../../_services/terminal.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetTerminal } from '../../../_models/terminal/get-terminal';

@Component({
  selector: 'app-all-terminals',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './all-terminals.component.html',
  styleUrl: './all-terminals.component.css',
})
export class AllTerminalsComponent implements OnInit, OnDestroy {
  private readonly terminalService = inject(TerminalService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private subscribtions: Subscription | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalResult: number = 0;
  terminals: GetTerminal[] = [];
  pages: number[] = [];

  ngOnInit(): void {
    this.fetchData();
    this.subscribtions = this.activeRoute.queryParams.subscribe({
      next: (qParams) => {
        const needToRefresh = qParams['r'];
        if (needToRefresh === 'true') this.fetchData();
      },
    });
  }

  private fetchData() {
    this.terminalService.getTerminals(this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.totalResult = res.total;
        this.totalPages = Math.ceil(res.total / this.pageSize);
        this.terminals = res.data;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscribtions?.unsubscribe();
  }

  changePage(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    const value: number = +target.value;
    if (!value || value > this.totalPages) return;
    this.pageIndex = value;
    this.fetchData();
  }
  previous() {
    if (this.pageIndex <= 1) return;
    --this.pageIndex;
    this.fetchData();
  }
  next() {
    if (this.pageIndex >= this.totalPages) return;
    ++this.pageIndex;
    this.fetchData();
  }
}
