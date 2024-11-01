import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../../../_models/Category/category';
import { CategoryService } from '../../../_services/category.service';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.css',
})
export class UpdateCategoryComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly activeRoute = inject(ActivatedRoute);
  private subscriptions: Subscription | null = null;
  public category: Category | null = null;
  updateCategoryForm!: FormGroup;
  formErrors: string[] = [];

  ngOnInit(): void {
    this.updateCategoryForm = new FormGroup({
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        const id = params['id'];
        if (!id) this.router.navigateByUrl('dashboard/categories');
        this.categoryService.getCategoryById(+id).subscribe({
          next: (res) => {
            this.category = res;
            this.updateCategoryForm.controls['name'].setValue(
              this.category.name
            );
          },
          error: (err) => {
            // navigate to error page
            this.router.navigateByUrl('dashboard/categories');
          },
        });
      },
      error: (err) => {
        this.router.navigateByUrl('dashboard/categories');
      },
    });
  }
  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  updateCategory() {
    this.formErrors = [];
    if (this.updateCategoryForm.status !== 'VALID') {
      var fields: string[] = ['name'];

      fields.forEach((field) => {
        const fieldErrors = this.updateCategoryForm.controls[field].errors;
        if (fieldErrors && fieldErrors['required']) {
          this.formErrors.push(`${field} is required`);
        } else if (fieldErrors && fieldErrors['minlength']) {
          this.formErrors.push(
            `${field} must have more than ${fieldErrors['minlength']['requiredLength']} characters`
          );
        }
      });
      return;
    }
    const name: string = this.updateCategoryForm.controls['name'].value;
    const formData: FormData = new FormData();
    const id = this.category!.id;
    this.categoryService.updateCategory(id, name).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/categories?r=true');
      },
      error: (err) => {
        this.formErrors.push();
      },
    });
  }
}
