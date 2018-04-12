import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { TripResponse, UserDetail, UserModel } from '../../../_services/models';

@Component({
  selector: 'app-tripdetail',
  templateUrl: './tripdetail.component.html',
  styleUrls: ['./tripdetail.component.css']
})
export class TripdetailComponent implements OnInit {
  @ViewChild('confirmBookingModal') confirmBookingModal;

  trip: TripResponse;
  user: UserDetail;

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.loadTripDetails();
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

    // const data2 = {
    //   tripID: 73,
    //   action: 'getTrips'
    // };
    // const ownerID2 = 44;
// RICORDARSI DI RIMUOVERE IL MOCKUP!
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
    console.log(res);
    if (res.length === 1) {
      this.trip = res[0];
    }
  }

  private setUser(res) {
    console.log(`User: ${res}`);
    this.app.shared.storage.browsedUser = JSON.parse(res);
    this.user = this.app.shared.storage.browsedUser;
  }

  goToUserDetails() {
    this.app.shared.router.navigateByUrl('dashboard');
  }

  confirmBooking() {
    this.app.shared.openModal(this.confirmBookingModal);
  }

  createBooking() {
    this.app.router.navigateByUrl('myprofile/mytrips');
  }

  goToMessages() {
    this.app.shared.storage.newConversation = true;
    if (!this.app.shared.navigateIfLogged('myprofile/messages')) {
      alert('not logged');
    }
  }
}
