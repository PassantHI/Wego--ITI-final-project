import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoomsBookingComponent } from './user-rooms-booking.component';

describe('UserRoomsBookingComponent', () => {
  let component: UserRoomsBookingComponent;
  let fixture: ComponentFixture<UserRoomsBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoomsBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoomsBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
