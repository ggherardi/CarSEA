import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { Models, City } from '../_services/models';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http/';
import { Headers } from '@angular/http';
import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-pathchooser',
  templateUrl: './pathchooser.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./pathchooser.component.css?ver=${new Date().getTime()}']
})
export class PathchooserComponent implements OnInit {

  formGroup: FormGroup;
  map = new Map(0, 0);
  origineCity: any;
  destinazioneCity: any;

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
    this.formGroup = this.formBuilder.group({
      origine: '',
      destinazione: ''
    });
    // this.retrieveRoute();
  }

  getCurrentLocation() {
    if (navigator.geolocation !== undefined) {
      navigator.geolocation.getCurrentPosition(res => {
        this.map.lat = res.coords.latitude;
        this.map.lng = res.coords.longitude;
      }, err => {
        console.log('Errore durante il get della posizione: ' + err);
      });
    } else {
      this.app.shared.httpService.get('http://ipinfo.io/json').subscribe(data => this.mapLocation(data));
    }
  }

  mapLocation(data) {
    if (data !== undefined) {
      const location = data.loc.split(',');
      this.map.lat = Number(location[0]);
      this.map.lng = Number(location[1]);
      console.log(this.map);
    }
  }

  setMarker(event) {
    console.log(this.origineCity);
    this.retrieveRoute();
  }

  retrieveRoute() {
    this.mapsApiLoader.load().then(res => {
      console.log(res);
      const origin = new google.maps.LatLng(55.930385, -3.118425);
      const destination = new google.maps.LatLng(50.087692, 14.421150);
      const directions = new google.maps.DirectionsService();
        directions.route({
        origin: origin,
          destination: destination,
          travelMode: 'DRIVING',
          avoidHighways: false,
          avoidTolls: false,
        }, this.retrieveRouteCallback);
    });
 
  }

  retrieveRouteCallback = (res) => {
    console.log(res);
  }

  mapRoute(data) {
    console.log(data);
  }
}

class Map {
  lat: number;
  lng: number;

  constructor(lat, lgn) {
    this.lat = lat;
    this.lng = lgn;
  }
}
