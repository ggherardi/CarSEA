import { Component, OnInit, Input } from '@angular/core';
import { TripResponse, UserDetail } from '../../../_services/models';
import { DatePipe } from '@angular/common';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-tripabstract',
  templateUrl: './tripabstract.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./tripabstract.component.css?ver=${new Date().getTime()}']
})
export class TripabstractComponent implements OnInit {
  @Input()
  Trip: TripResponse;

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

  goToTripDetails() {
    this.app.shared.storage.browsedTripID = this.Trip.tripId;
    this.app.shared.storage.browsedUserID = this.Trip.ownerId;
    this.app.shared.router.navigateByUrl('tripdetail');
  }

}
