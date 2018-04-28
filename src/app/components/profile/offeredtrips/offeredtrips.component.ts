import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { BookingResponse, TripResponse, BookingStatus } from '../../../_services/models';

@Component({
  selector: 'app-offeredtrips',
  templateUrl: './offeredtrips.component.html',
  styleUrls: ['./offeredtrips.component.css']
})
export class OfferedtripsComponent implements OnInit {
  @ViewChild('bookingModal') bookingModal;

  availableSeats: number;
  allBookings: BookingResponse[] = [];
  allPendingBookings: BookingResponse[] = [];
  allApprovedBookings: BookingResponse[] = [];
  allRejectedBookings: BookingResponse[] = [];
  allActiveTrips: TripResponse[] = [];
  allPastTrips: TripResponse[] = [];

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.app.shared.redirectIfNotLogged();
    this.getTrips();
  }

  private getTrips() {
    this.app.api.getTripsForUser(this.app.shared.models.userModel.UserID).subscribe(
      this.manageTrips.bind(this),
      err => console.log(err)
    );
  }

  private manageTrips(res) {
    const allTrips = res;
    this.allActiveTrips = allTrips.slice().filter(b => new Date(b.departureDate).getTime() > Date.now());
    this.allPastTrips = allTrips.slice().filter(b => new Date(b.departureDate).getTime() < Date.now());
  }

  private manageBookings(trip: TripResponse) {
    this.availableSeats = trip.seats;
    this.app.api.getBookingsForTrip(trip.tripId).subscribe(
      this.openBookingsModal.bind(this),
      err => console.log(err)
    );
  }

  private openBookingsModal(res: BookingResponse[]) {
    console.log(res);
    if (res.length > 0) {
      this.allBookings = res;
      this.allPendingBookings = this.allBookings.filter(b => b.bookingStatusCode === BookingStatus.Pending);
      this.allApprovedBookings = this.allBookings.filter(b => b.bookingStatusCode === BookingStatus.Accepted);
      this.allRejectedBookings = this.allBookings.filter(b => b.bookingStatusCode === BookingStatus.Rejected
                                                            || b.bookingStatusCode === BookingStatus.Canceled);
      this.app.shared.openModal(this.bookingModal);
    }
  }

  private setBookingArrays() {
    alert('test');
  }

  private goToTripDetails(tripId) {
    this.app.shared.storage.browsedUserID = this.app.shared.models.userModel.UserID;
    this.app.shared.storage.browsedTripID = tripId;
    this.app.shared.router.navigateByUrl('tripdetail');
  }

  approvalBookingClickEvent(booking: BookingResponse, approved: boolean) {
    const bookingNewStatus: BookingStatus = approved ? BookingStatus.Accepted : BookingStatus.Rejected;
    this.app.api.setBookingStatus(booking, bookingNewStatus).subscribe(
      this.manageBookings.bind(this),
      err => console.log(err)
    );
  }
}
