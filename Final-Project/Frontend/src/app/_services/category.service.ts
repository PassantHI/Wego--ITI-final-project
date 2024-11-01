import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../_models/Category/category';
import { GenericResponse } from '../_models/generic-response';
import { CategoryLocation } from '../_models/Category/category-location';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `https://localhost:7024/api/Categories`;
  private client = inject(HttpClient);
  getCategories() {
    return this.client.get<GenericResponse<Category>>(this.apiUrl);
  }
  getCategoryLocations(id: number) {
    return this.client.get<CategoryLocation[]>(
      `${this.apiUrl}/${id}/locations`
    );
  }

  getCategoryById(id: number) {
    return this.client.get<Category>(`${this.apiUrl}/${id}`);
  }
  newCategory(name: string) {
    return this.client.post<Category>(`${this.apiUrl}?name=${name}`, {});
  }
  deleteCategory(id: number) {
    return this.client.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateCategory(id: number, name: string) {
    return this.client.put<Category>(
      `${this.apiUrl}/${id}?id=${id}&name=${name}`,
      {}
    );
  }
}
