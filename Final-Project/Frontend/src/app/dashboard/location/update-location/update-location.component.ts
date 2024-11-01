import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocationService } from '../../../_services/location.service';
import { Category } from '../../../_models/Category/category';
import { CategoryService } from '../../../_services/category.service';
import { GetLocation } from '../../../_models/Location/get-location';
@Component({
  selector: 'app-update-location',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './update-location.component.html',
  styleUrl: './update-location.component.css',
})
export class UpdateLocationComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly locationService = inject(LocationService);
  private readonly categoryService = inject(CategoryService);
  private readonly activeRoute = inject(ActivatedRoute);
  private subscriptions: Subscription | null = null;
  public imageFile: File | null = null;
  locationForm!: FormGroup;
  location: GetLocation | null = null;
  formErrors: string[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.locationForm = new FormGroup({
      country: new FormControl<string>('', [Validators.minLength(2)]),
      city: new FormControl<string>('', [Validators.minLength(2)]),
      image: new FormControl<File | null>(null, []),
      categories: new FormArray([]),
    });
    this.fetchCategories();
  }
  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
  private fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.fetchSelectedLocation();
      },
    });
  }
  private fetchSelectedLocation() {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        const id = params['id'];
        if (!id) this.router.navigateByUrl('dashboard/locations');
        this.locationService.getLocationById(+id).subscribe({
          next: (res) => {
            this.location = res;
            if (!this.location) {
              this.router.navigateByUrl('dashboard/locations');
              return;
            }
            this.locationForm.controls['city'].setValue(this.location.city);
            this.locationForm.controls['country'].setValue(
              this.location.country
            );

            const formArray = this.locationForm.get('categories') as FormArray;
            this.location.categoryIds.forEach((c) => {
              formArray.push(new FormControl(c));
            });
          },
          error: (err) => {
            // navigate to error page
            this.router.navigateByUrl('dashboard/locations');
          },
        });
      },
      error: (err) => {
        this.router.navigateByUrl('dashboard/locations');
      },
    });
  }
  updateImageFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.imageFile = target.files[0];
    }
  }

  onCheckboxChange(event: Event) {
    const formArray = this.locationForm.get('categories') as FormArray;
    const element = event.target as HTMLInputElement;
    if (element.checked) formArray.push(new FormControl(element.value));
    else {
      const index = formArray.controls.findIndex(
        (x) => x.value === element.value
      );
      formArray.removeAt(index);
    }
  }

  updateLocation() {
    this.formErrors = [];
    if (this.locationForm.status !== 'VALID') {
      var fields: string[] = ['country', 'city', 'image'];

      fields.forEach((field) => {
        const fieldErrors = this.locationForm.controls[field].errors;
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
    const country: string = this.locationForm.controls['country'].value;
    const city: string = this.locationForm.controls['city'].value;
    const CategoryIdsString: string[] =
      this.locationForm.controls['categories'].value;
    // const CategoryIds: number[] = CategoryIdsString.map((id) => +id);

    const formData: FormData = new FormData();
    formData.append('country', country);
    formData.append('city', city);
    if (this.imageFile) formData.append('image', this.imageFile as File);
    // formData.append('CategoryIds', JSON.stringify(CategoryIds));
    CategoryIdsString.forEach((id) => formData.append('CategoryIds', id));

    this.locationService.updateLocation(this.location!.id, formData).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/dashboard/locations?r=true');
      },
      error: (err) => {
        console.log(err.status);
        this.formErrors.push(err.message);
      },
    });
  }
}
