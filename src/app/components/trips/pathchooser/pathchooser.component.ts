import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { Models, City, Map, Trip } from '../../../_services/models';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http/';
import { Headers } from '@angular/http';
import { LatLngBounds, LatLng } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-pathchooser',
  templateUrl: './pathchooser.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./pathchooser.component.css?ver=${new Date().getTime()}']
})
export class PathchooserComponent implements OnInit {

  maxNumeroTappe: Number = 3;
  formGroup: FormGroup;
  formGroupDates: FormGroup;
  currentPosition: Map = new Map(0, 0);
  baseMarkers: SortableMap[] = [];
  additionalMarkers: SortableMap[] = [];
  allMarkers: SortableMap[] = [];
  startingCity: SortableMap;
  arrivalCity: SortableMap;
  cityControls: CityControl[] = [new CityControl(0, 'wayPoint_0')];
  polyArray: LatLng[];
  bounds: LatLngBounds;
  mapZoom: Number = 5;
  disableAddControl = false;
  nextStepDisabled: Boolean = true;

  /** Effettua una query sul DB utilizzando la chiave di ricerca inserita nelle textbox
   * origine e destinazione. Ritorna il valore esatto come primo risultato, poi gli altri. */
  searchCities = (keyword: any): Observable<any[]> => {
    const serviceUrl = 'php/CitiesService.php';
    const data = {
      action: 'search',
      searchKey: keyword
    };
    return this.app.shared.post(serviceUrl, data);
  }

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getCurrentLocation();
    this.buildForm();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      departureCityPicker: ['', [Validators.required]],
      arrivalCityPicker: ['', [Validators.required]],
      wayPoint_0: ['', ],
      startDatePicker: ['', [Validators.required]],
      startTimePicker: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      distance: ['', [Validators.required]]
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
      }, {timeout: 5000});
    } else {
      this.app.shared.httpService.getExternal('https://ipinfo.io/json').subscribe((data: any) => {
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
      case 'departureCityPicker':
        this.startingCity = waypoint;
        this.baseMarkers.unshift(waypoint);
        break;
      case 'arrivalCityPicker':
        this.arrivalCity = waypoint;
        this.baseMarkers.push(waypoint);
        break;
      default:
        this.additionalMarkers.push(waypoint);
        this.additionalMarkers.sort(this.indexSorting);
    }
    this.formGroup.get(controlName).disable();
    this.allMarkers = this.baseMarkers.slice();
    this.retrieveRoute();
  }

  private indexSorting = function(a, b) {
    let sort = 0;
    if (a.index === b.index) {
      sort = 0;
    }
    a.index > b.index ? sort = 1 : sort = -1;
    return sort;
  };

  /** Recupera il percorso tramite le API JavaScript di google maps */
  retrieveRoute() {
    if (this.startingCity !== undefined && this.arrivalCity !== undefined) {
      this.combineAllMarkers();
      this.app.shared.googleMapsService.retrieveRoute(this.allMarkers, this.retrieveRouteCallback.bind(this));
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
    if (res.routes.length > 0) {
      this.polyArray = this.app.shared.googleMapsService.getPolylinesArray(res.routes[0].overview_polyline);
      this.bounds = res.routes[0].bounds;
      this.setDistanceAndDuration(res.routes[0].legs);
    }
  }

  /** Setta negli hidden field duration e distance i valori in secondi e metri di durata e distanza */
  setDistanceAndDuration(legs: any) {
    let distance = 0;
    let duration = 0;
    legs.forEach(l => {
      duration += l.duration.value;
      distance += l.distance.value;
    });
    this.formGroup.get('duration').setValue(duration);
    this.formGroup.get('distance').setValue(distance);
  }

  /** Rimuove il waypoint tramite il pulsante cestina */
  removeWaypoint(controlName: string, index: number) {
    this.formGroup.get(controlName).enable();
    this.formGroup.get(controlName).setValue('');

    switch (controlName) {
      case 'departureCityPicker':
        this.startingCity = undefined;
        break;
      case 'arrivalCityPicker':
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
   * Se esistono più di 4 controlli il pulsante di aggiunta viene disattivato. */
  addCityControl(nomeTappa: string) {
    const newControlId = this.cityControls.length;
    const newControlName = 'wayPoint_' + newControlId;
    this.cityControls.push(new CityControl(newControlId, newControlName));
    this.formGroup.addControl(newControlName, new FormControl());
    if (newControlId >= this.maxNumeroTappe) {
      this.disableAddControl = true;
    }
  }

  /** Salva il primo step dell'offerta. Istanzia un nuovo oggetto di tipo Trip, che verrà
   * poi compilato nei campi mancanti dal secondo step */
  saveFirstStep() {
    console.log('saving');
    const formValues: City[] = [];
    const waypoints: number[] = [];
    for (const controlName of Object.keys(this.formGroup.controls)) {
      formValues[controlName] = this.formGroup.get(controlName).value;
    }
    for (const waypoint of Object.keys(formValues)) {
      if (waypoint.indexOf('wayPoint') > -1) {
        waypoints.push(formValues[waypoint]);
      }
    }
    const fullDate = formValues['startDatePicker'] + ' ' + formValues['startTimePicker'];
    this.app.shared.models.newTrip =
      new Trip(
        formValues['departureCityPicker'],
        formValues['arrivalCityPicker'],
        waypoints,
        formValues['duration'],
        formValues['distance'],
        fullDate
      );
    this.app.shared.models.allMarkers = this.allMarkers.slice();
    this.app.router.navigateByUrl('/newtrip/pricechooser');
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

/** Classe di supporto per il sorting delle tappe */
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
