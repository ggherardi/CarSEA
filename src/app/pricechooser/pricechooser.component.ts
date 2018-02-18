import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Map, UserModel } from '../_services/models';
import { LatLngBounds, LatLng } from '@agm/core/services/google-maps-types';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pricechooser',
  templateUrl: './pricechooser.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./pricechooser.component.css?ver=${new Date().getTime()}']
})
export class PricechooserComponent implements OnInit {

  @ViewChild('modalContent') modalContent;
  formGroup: FormGroup;
  allMarkers: Map[];
  polyArray: LatLng[];
  bounds: LatLngBounds;
  closeResult: string;

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.app.shared.models.newTrip === undefined) {
      this.app.shared.router.navigateByUrl('/newtrip/pathchooser');
    }
    this.allMarkers = this.app.shared.models.allMarkers;
    this.buildForm();
    this.retrieveRoute();
    console.log(JSON.stringify(this.app.shared.models.newTrip));
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      pricePicker: ['', [Validators.required]],
      seatsPicker: ['', [Validators.required]],
      descriptionPicker: ['', ]
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

  saveTrip() {
    this.app.shared.models.newTrip.price = this.formGroup.get('pricePicker').value;
    this.app.shared.models.newTrip.seats = this.formGroup.get('seatsPicker').value;
    this.app.shared.models.newTrip.description = this.formGroup.get('descriptionPicker').value;
    const userObj: UserModel = this.app.shared.cookies.getObjectFromCookie(this.app.shared.cookies.USER_COOKIE_NAME);
    this.app.shared.models.newTrip.ownerId = userObj.UserID;
    const stringifiedTrip = JSON.stringify(this.app.shared.models.newTrip);
    const tripData = {
      action: 'saveNewTrip',
      trip: stringifiedTrip
    };
    this.app.shared.post('php/TripService.php', tripData)
        .subscribe(succ => console.log(succ), err => { console.log(err); this.openModal(this.modalContent); } );
  }

  openModal(content) {
    this.app.shared.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
