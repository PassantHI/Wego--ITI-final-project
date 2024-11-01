import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../_models/Category/category';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css',
})
export class AllCategoriesComponent implements OnInit, OnDestroy {
  private readonly categoryService = inject(CategoryService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private subscribtions: Subscription | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalResult: number = 0;
  allCategories: Category[] = [];
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
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.totalResult = res.total;
        this.totalPages = Math.ceil(res.total / this.pageSize);
        this.allCategories = res.data;
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
