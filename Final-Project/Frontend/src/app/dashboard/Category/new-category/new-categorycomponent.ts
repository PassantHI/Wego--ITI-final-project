import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../../_services/category.service';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css',
})
export class NewCategoryComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private subscriptions: Subscription | null = null;
  public imageFile: File | null = null;
  categoryForm!: FormGroup;
  formErrors: string[] = [];

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });
  }
  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  addCategory() {
    this.formErrors = [];
    if (this.categoryForm.status !== 'VALID') {
      var fields: string[] = ['name'];

      fields.forEach((field) => {
        const fieldErrors = this.categoryForm.controls[field].errors;
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
    const name: string = this.categoryForm.controls['name'].value;

    this.categoryService.newCategory(name).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/categories?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }
}
