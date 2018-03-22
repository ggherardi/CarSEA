import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { TripResponse } from '../../../_services/models';

@Component({
  selector: 'app-tripdetail',
  templateUrl: './tripdetail.component.html',
  styleUrls: ['./tripdetail.component.css']
})
export class TripdetailComponent implements OnInit {

  trip: TripResponse;

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.loadTripDetails();
  }

  private loadTripDetails() {
    const tripID = this.app.shared.storage.browsedTripID;
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
  }

  private setTrip(res) {
    console.log(res);
    if (res.length === 1) {
      this.trip = res[0];
    }
  }
}
