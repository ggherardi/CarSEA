import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { BookingResponse } from '../../../_services/models';

@Component({
  selector: 'app-mytrips',
  templateUrl: './mytrips.component.html',
  styleUrls: ['./mytrips.component.css']
})
export class MytripsComponent implements OnInit {
  @ViewChild('cancelBookingModal') cancelBookingModal;

  allBookings: BookingResponse[] = [];
  allActiveBookings: BookingResponse[] = [];
  allPastBookings: BookingResponse[] = [];

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.app.shared.redirectIfNotLogged();
    this.populateControls();
  }

  private populateControls() {
    this.app.api.getBookingsForUser(this.app.shared.models.userModel.UserID).subscribe(
      this.manageBookings.bind(this),
      err => console.log(err)
    );
  }

  private manageBookings(res: BookingResponse[]) {
    this.allBookings = res;
    console.log(this.allBookings[0].departureDate);
    this.allActiveBookings = this.allBookings.slice().filter(b => new Date(b.departureDate).getTime() > Date.now());
    this.allPastBookings = this.allBookings.slice().filter(b => new Date(b.departureDate).getTime() < Date.now());
  }

  goToTripDetails(booking: BookingResponse) {
    this.app.shared.storage.browsedTripID = booking.tripId;
    this.app.shared.storage.browsedUserID = booking.tripOwnerId;
    this.app.shared.router.navigateByUrl('tripdetail');
  }

  private goToMessages(booking: BookingResponse) {
    this.app.shared.loadUserDetails(booking.tripOwnerId).subscribe(
      succ => {
        this.app.shared.storage.browsedUser = JSON.parse(succ);
        this.app.shared.storage.newConversation = true;
        this.app.shared.navigateIfLogged('myprofile/messages');
      },
      err => console.log(err)
    );

  }

  private openCancelBookingModal() {
    this.app.shared.openModal(this.cancelBookingModal);
  }
}
