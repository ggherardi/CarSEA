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
import { LatLngBounds } from '@agm/core/services/google-maps-types';
declare var google;

@Component({
  selector: 'app-pathchooser',
  templateUrl: './pathchooser.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./pathchooser.component.css?ver=${new Date().getTime()}']
})
export class PathchooserComponent implements OnInit {

  alphabet: String[] = 'abcdefghilmnopqrstuvz'.toUpperCase().split('');
  formGroup: FormGroup;
  currentPosition: Map = new Map(0, 0);
  baseMarkers: SortableMap[] = [];
  additionalMarkers: SortableMap[] = [];
  allMarkers: SortableMap[] = [];
  startingCity: SortableMap;
  arrivalCity: SortableMap;
  cityControls: CityControl[] = [new CityControl(0, 'wayPoint_0')];
  origineCity: City;
  destinazioneCity: City;
  polyArray: any[];
  bounds: LatLngBounds;
  mapZoom: Number = 5;
  disableAddControl = true;

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
      origin: '',
      destination: '',
      wayPoint_0: ''
    });
  }

  autocompleListFormatter(data: City): string {
    return `${data['id_regione']} - ${data['value']}`;
  }

  autocompleteValueFormatter(data: City) {
    return data.value;
  }

  checkValueNotEmpty(value): Boolean {
    return this.formGroup.get(value).value;
  }

  /** Chrome: recupera la posizione attuale utilizzando il navigator
   * IE: recupera la posizione attuale chiamando un servizio che restituisce
   * la geolocalizzazione */
  getCurrentLocation() {
    if (navigator.geolocation !== undefined) {
      navigator.geolocation.getCurrentPosition(res => {
        this.currentPosition.lat = res.coords.latitude;
        this.currentPosition.lng = res.coords.longitude;
      }, err => {
        console.log('(getCurrentLocation) Errore: ' + err);
      });
    } else {
      this.app.shared.httpService.get('http://ipinfo.io/json').subscribe((data: any) => {
        if (data !== undefined) {
          const location = data.loc.split(',');
          this.currentPosition.lat = Number(location[0]);
          this.currentPosition.lng = Number(location[1]);
          console.log(this.currentPosition);
        }
      });
    }
  }

  /** Gestisce l'aggiunta dei waypoint. Quando sono popolati origine e destinazione viene
   * richiamato il metodo che restituisce la route desiderata */
  manageCitiesChoices(event: any, controlName: string) {
    const lat = parseFloat(event.latitudine);
    const lng = parseFloat(event.longitudine);
    const index = parseInt(controlName.split('_')[1], 10);
    const waypoint: SortableMap = new SortableMap(lat, lng, event.id, index);
    switch (controlName) {
      case 'origin':
        this.startingCity = waypoint;
        this.baseMarkers.unshift(waypoint);
        break;
      case 'destination':
        this.arrivalCity = waypoint;
        this.baseMarkers.push(waypoint);
        break;
      default:
        this.additionalMarkers.push(waypoint);
        this.additionalMarkers.sort(a => a.index);
        this.disableAddControl = false;
        break;
    }
    this.formGroup.get(controlName).disable();
    this.allMarkers = this.baseMarkers.slice();
    this.retrieveRoute();
  }

  /** Recupera il percorso tramite le API JavaScript di google maps */
  retrieveRoute() {
    if (this.startingCity !== undefined && this.arrivalCity !== undefined) {
      const originPoint = this.baseMarkers[0];
      const destinationPoint = this.baseMarkers[this.baseMarkers.length - 1];
      this.combineAllMarkers();
      this.app.shared.googleMapsService.retrieveRoute(
        originPoint, destinationPoint, this.retrieveRouteCallback.bind(this), this.allMarkers
      );
    }
  }

  /** Combina i marker di base (origine e destinazione) con tutte le tappe intermedie */
  combineAllMarkers() {
    this.allMarkers = this.baseMarkers.slice();
    const tempDestination: SortableMap = this.allMarkers.pop();
    this.allMarkers = this.allMarkers.concat(this.additionalMarkers);
    if (tempDestination !== undefined) {
      this.allMarkers.push(tempDestination);
    }
  }

  /** Setta nella proprietà polyArray il percorso stradale tra l'origine e la destinazione */
  retrieveRouteCallback(res: any, d) {
    console.log(res);
    if (res.routes.length > 0) {
      this.polyArray = this.app.shared.googleMapsService.getPolylinesArray(res.routes[0].overview_polyline);
      this.bounds = res.routes[0].bounds;
    }
  }

  /** Rimuove il waypoint tramite il pulsante cestina */
  removeWaypoint(controlName: string, index: number) {
    this.formGroup.get(controlName).enable();
    this.formGroup.get(controlName).setValue('');

    switch (controlName) {
      case 'origin':
        this.startingCity = undefined;
        break;
      case 'destination':
        this.arrivalCity = undefined;
        break;
    }

    if (controlName.indexOf('wayPoint') > -1) {
      const indexToRemove = this.additionalMarkers.findIndex(a => a.index === index);
      this.additionalMarkers.splice(indexToRemove, 1);
    } else {
      this.baseMarkers.splice(index, 1);
    }

    if (this.baseMarkers.length === 2) {
     this.retrieveRoute();
    } else {
      this.polyArray = [];
      this.allMarkers = this.baseMarkers.slice();
    }
  }

  /** Aggiunge dinamicamente i controlli di autocompletamento per gestire le tappe intermedie.
   * Se estiono più di 5 controlli, il pulsante di aggiunta viene disattivato.   */
  addCityControl(nomeTappa: string) {
    const newControlId = this.cityControls.length + 1;
    const newControlName = 'wayPoint_' + newControlId;
    this.cityControls.push(new CityControl(newControlId, newControlName));
    this.formGroup.addControl(newControlName, new FormControl());
    if (newControlId < 5) {
      this.disableAddControl = true;
    }
  }
}

/** Classe di supporto per la generazione dinamica dei controlli autocomplete */
class CityControl {
  name: string;
  id: Number;

  constructor(id: Number, name: string) {
    this.name = name;
    this.id = id;
  }
}

class SortableMap extends Map {
  id: number;
  lat: number;
  lng: number;
  index: number;

  constructor(lat: number, lng: number, id: number = 0, index: number = 0) {
    super(lat, lng);
    this.id = id;
    this.index = index;
  }
}
