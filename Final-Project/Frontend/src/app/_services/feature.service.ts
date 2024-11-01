import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetFeature } from '../_models/feature/get-feature';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private readonly apiUrl = `https://localhost:7024/api/Features`;
  private client = inject(HttpClient);
  getFeatures() {
    return this.client.get<GetFeature[]>(this.apiUrl);
  }
}
