import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { TripResponse, UserDetail, UserModel, NewBooking, BookingResponse } from '../../../_services/models';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tripdetail',
  templateUrl: './tripdetail.component.html',
  styleUrls: ['./tripdetail.component.css']
})
export class TripdetailComponent implements OnInit {
  @ViewChild('confirmBookingModal') confirmBookingModal;
  confirmBookingModalRef: NgbModalRef;

  currentUser: UserModel;
  trip: TripResponse;
  browserUser: UserDetail;
  existsBooking = false;

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.loadTripDetails();
  }

  private loadCurrentUser() {
    this.currentUser = this.app.shared.getCurrentUser();
  }

  private loadTripDetails() {
    const tripID = this.app.shared.storage.browsedTripID;
    const ownerID = this.app.shared.storage.browsedUserID;
    if (tripID === undefined) {
      this.app.shared.router.navigateByUrl('');
      return;
    }
    const data = {
      tripID: tripID,
      action: 'getTrips'
    };

    this.app.shared.post('php/tripservice.php', data).subscribe(
      this.setTrip.bind(this),
      err => {
        console.log(err);
        this.app.shared.router.navigateByUrl('');
      });

      this.app.shared.loadUserDetails(ownerID).subscribe(
        this.setUser.bind(this),
        err => console.log(err)
      );
  }

  private setTrip(res) {
    if (res.length === 1) {
      this.trip = res[0];
      this.loadExistingBooking();
    }
  }

  private setUser(res) {
    this.app.shared.storage.browsedUser = JSON.parse(res);
    this.browserUser = this.app.shared.storage.browsedUser;
  }

  loadExistingBooking() {
    this.app.api.getExistingBooking(new NewBooking(this.currentUser.UserID, this.trip.tripId)).subscribe(
      this.manageExistingBooking.bind(this),
      err => console.log(err)
    );
  }

  manageExistingBooking(res: BookingResponse) {
    console.log(res);
    if (res !== null) {
      this.existsBooking = true;
    }
  }

  goToUserDetails() {
    this.app.shared.router.navigateByUrl('dashboard');
  }

  confirmBooking() {
    this.confirmBookingModalRef = this.app.shared.openModal(this.confirmBookingModal);
  }

  createBooking() {
    this.app.shared.closeModal(this.confirmBookingModalRef);
    if (this.currentUser !== undefined) {
      this.app.api.insertBooking(new NewBooking(this.currentUser.UserID, this.trip.tripId)).subscribe(
        succ => this.app.router.navigateByUrl('myprofile/mytrips'),
        err => console.log(err)
      );
    } else {
      alert('not logged');
    }
  }

  goToMessages() {
    this.app.shared.storage.newConversation = true;
    if (!this.app.shared.navigateIfLogged('myprofile/messages')) {
      alert('not logged');
    }
  }
}
