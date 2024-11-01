import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../_models/Category/category';

@Component({
  selector: 'app-category-detials',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit, OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  categoryId: number | null = null;
  category: Category | null = null;
  private subscriptions: Subscription | null = null;

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
          },
        });
      },
    });
  }
}
