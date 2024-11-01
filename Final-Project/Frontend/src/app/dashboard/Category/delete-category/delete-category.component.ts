import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../../../_models/Category/category';
import { CategoryService } from '../../../_services/category.service';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.css',
})
export class DeleteCategoryComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  internalError: string | null = null;
  categoryId: number | null = null;
  category: Category | null = null;
  private subscriptions: Subscription | null = null;

  delete() {
    if (!this.categoryId || !this.category) return;

    this.categoryService.deleteCategory(this.categoryId).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard/categories?r=true');
      },
      error: (err) => {
        this.internalError = err.message;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.categoryId = +params['id'];
        this.categoryService.getCategoryById(this.categoryId).subscribe({
          next: (res) => {
            this.category = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
            this.router.navigateByUrl('/dashboard/categories');
          },
        });
      },
    });
  }
}
