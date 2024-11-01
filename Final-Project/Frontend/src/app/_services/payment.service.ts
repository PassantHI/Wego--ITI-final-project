import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CheckoutDto } from '../_models/checkoutDto';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly apiUrl: string = `https://localhost:7024/api/Payment/checkout`;
  private readonly client = inject(HttpClient);

  payNow(reqData: CheckoutDto) {
    return this.client.post<{ url: string }>(this.apiUrl, reqData);
  }
}
