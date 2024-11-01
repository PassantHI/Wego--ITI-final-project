import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../_models/Category/category';
import { CategoryLocation } from '../../../_models/Category/category-location';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-ideas',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './trip-ideas.component.html',
  styleUrl: './trip-ideas.component.css',
})
export class TripIdeasComponent {
  private readonly categoryService = inject(CategoryService);
  categories: Category[] = [];
  selectedLocations: CategoryLocation[] = [];
  selectedCategoryId: number = 0;

  changeCategory(id: number) {
    this.selectedCategoryId = id;
    this.categoryService
      .getCategoryLocations(this.selectedCategoryId)
      .subscribe({
        next: (res) => {
          this.selectedLocations = res;
        },
      });
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        if (this.categories.length > 0) {
          this.selectedCategoryId = this.categories[0].id;
          this.categoryService
            .getCategoryLocations(this.selectedCategoryId)
            .subscribe({
              next: (res) => {
                this.selectedLocations = res;
              },
            });
        }
      },
    });
  }
}
