import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Map } from '../_services/models';
import { LatLngBounds, LatLng } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-pricechooser',
  templateUrl: './pricechooser.component.html',
  styleUrls: ['./pricechooser.component.css']
})
export class PricechooserComponent implements OnInit {

  formGroup: FormGroup;
  allMarkers: Map[];
  polyArray: LatLng[];
  bounds: LatLngBounds;
  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.app.shared.models.newTrip === undefined) {
      this.app.shared.router.navigateByUrl('/newtrip/pathChooser');
    }
    this.allMarkers = this.app.shared.models.allMarkers;
    this.retrieveRoute();
    console.log(JSON.stringify(this.app.shared.models.newTrip));
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      departureCityPicker: ['', [Validators.required]],
      arrivalCityPicker: ['', [Validators.required]],
      wayPoint_0: ['', ],
      startDatePicker: ['', [Validators.required]],
      startTimePicker: ['', [Validators.required]]
    });
  }

  retrieveRoute() {
    this.app.shared.googleMapsService.retrieveRoute(this.allMarkers, this.retrieveRouteCallback.bind(this));
  }

  retrieveRouteCallback(res: any, d) {
    if (res.routes.length > 0) {
      this.polyArray = this.app.shared.googleMapsService.getPolylinesArray(res.routes[0].overview_polyline);
      this.bounds = res.routes[0].bounds;
    }
  }
}
