import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { Models, City, Map } from '../_services/models';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http/';
import { Headers } from '@angular/http';
declare var google;

@Component({
  selector: 'app-pathchooser',
  templateUrl: './pathchooser.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./pathchooser.component.css?ver=${new Date().getTime()}']
})
export class PathchooserComponent implements OnInit {

  formGroup: FormGroup;
  map = new Map(0, 0);
  origineCity: City;
  destinazioneCity: City;
  startingPoint: Map;
  arrivalPoint: Map;
  polyArray: any[];

  /** Effettua una query sul DB utilizzando la chiave di ricerca inserita nelle textbox
   * origine e destinazione. Ritorna il valore esatto come primo risultato, poi gli altri. */
  searchCities = (keyword: any): Observable<any[]> => {
    const serviceUrl = 'php/CitiesServices.php';
    const data = {
      action: 'search',
      searchKey: keyword
    };
    return this.app.shared.httpService.post(serviceUrl, data);
  }

  constructor(private app: AppComponent, private http: Http, private formBuilder: FormBuilder, private mapsApiLoader: MapsAPILoader) { }

  ngOnInit() {
    this.getCurrentLocation();
    this.buildForm();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      origine: '',
      destinazione: ''
    });
  }

  autocompleListFormatter(data: any): string {
    return `${data['id_regione']} - ${data['value']}`;
  }

  /** Chrome: recupera la posizione attuale utilizzando il navigator
   * IE: recupera la posizione attuale chiamando un servizio che restituisce
   * la geolocalizzazione */
  getCurrentLocation() {
    if (navigator.geolocation !== undefined) {
      navigator.geolocation.getCurrentPosition(res => {
        this.map.lat = res.coords.latitude;
        this.map.lng = res.coords.longitude;
      }, err => {
        console.log('(getCurrentLocation) Errore: ' + err);
      });
    } else {
      this.app.shared.httpService.get('http://ipinfo.io/json').subscribe((data: any) => {
        if (data !== undefined) {
          const location = data.loc.split(',');
          this.map.lat = Number(location[0]);
          this.map.lng = Number(location[1]);
          console.log(this.map);
        }
      });
    }
  }

  /** Gestisce il luogo di partenza e di arrivo. Quando sono popolati entrambi richiama il
   * metodo che restituisce la route desiderata */
  manageCitiesChoices(event, sender) {
    switch (sender) {
      case 'origin':
        this.startingPoint = new Map(this.origineCity.latitudine, this.origineCity.longitudine);
        break;
      case 'destination':
        this.arrivalPoint = new Map(this.destinazioneCity.latitudine, this.destinazioneCity.longitudine);
        break;
    }
    if (this.startingPoint && this.arrivalPoint) {
      this.app.shared.googleMapsService.retrieveRoute(
        this.startingPoint, this.arrivalPoint, this.retrieveRouteCallback.bind(this)
      );
    }
  }

  retrieveRouteCallback = (res: any) => {
    console.log(res);
    if (res.routes.length > 0) {
      this.polyArray = this.app.shared.googleMapsService.getPolylinesArray(res.routes[0].overview_polyline);
      console.log(this.polyArray);
    }
  }

  mapRoute(data) {
    console.log(data);
  }
}
