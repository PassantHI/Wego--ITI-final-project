export class CheckoutDto {
  constructor(
    public bookingType: string,
    public cancelUrl: string,
    public bookingIds: string[],
    public amount: number,
    public productName: string,
    public quantity: number,
    public description: string | null = null,
    public images: string[] | null = null,
    public currency: string = 'usd'
  ) {}
}
