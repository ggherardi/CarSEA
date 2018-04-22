import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { BookingResponse, TripResponse } from '../../../_services/models';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-offeredtrips',
  templateUrl: './offeredtrips.component.html',
  styleUrls: ['./offeredtrips.component.css']
})
export class OfferedtripsComponent implements OnInit {
  @ViewChild('editForm') editForm;
  editTripForm: FormGroup;

  allActiveTrips: TripResponse[] = [];
  allPastTrips: TripResponse[] = [];

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.app.shared.redirectIfNotLogged();
    this.initControls();
    this.getTrips();
  }

  private initControls() {
    this.editTripForm = this.formBuilder.group({
      
    });
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

  private getBookings() {
    this.app.api.getBookingsForTrip(34).subscribe(
      succ => console.log(succ),
      err => console.log(err)
    );
  }

  private openEditForm() {
    this.app.shared.openModal(this.editForm);
  }
}
