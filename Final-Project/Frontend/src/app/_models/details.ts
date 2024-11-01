import { Booking } from "./booking"

export interface Details {
roomBookingId?: number
  bookingId?: number
  roomId: string
  checkin: string
  checkout: string
  guests: string
  booking:Booking

}
