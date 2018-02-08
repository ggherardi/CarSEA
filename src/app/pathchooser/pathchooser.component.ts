import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { google } from '@agm/core/services/google-maps-types';
import { Models, City } from '../_common/models';
import { HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http/';
import { Headers } from '@angular/http';

@Component({
  selector: 'app-pathchooser',
  templateUrl: './pathchooser.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./pathchooser.component.css?ver=${new Date().getTime()}']
})
export class PathchooserComponent implements OnInit {

  formGroup: FormGroup;
  map = new Map(0, 0);
  res: any;
  cities: any = [];
  allCities: City[] = [];

  searchCities = (keyword: any): Observable<any[]> => {
    const serviceUrl = 'php/CitiesServices.php';
    const objData = {
      action: 'search',
      searchKey: keyword
    };
    const options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
    const querystringData = this.app.shared.httpService.toQueryString(objData);
    this.http.post('php/CitiesServices.php?first=1', querystringData, options)
      .map(r =>  r)
      .subscribe(a => console.log(a));
    return this.http.post('php/CitiesServices.php', querystringData, options).map(r =>  r.json());
  }

  constructor(private app: AppComponent, private http: Http, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getCurrentLocation();
    this.formGroup = this.formBuilder.group({
      origine: '',
      destinazione: ''
    });
    // this.retrieveRoute();
  }

  getCurrentLocation() {
    this.app.shared.httpService.getResponse('http://ipinfo.io/json').subscribe(data => this.mapLocation(data));
  }

  mapLocation(data) {
    if (data !== undefined) {
      const location = data.loc.split(',');
      this.map.lat = Number(location[0]);
      this.map.lng = Number(location[1]);
      console.log(this.map);
    }
  }

  searchCitiesCallback(res) {
    const cities: City[] = JSON.parse(res);
    this.allCities = [];
    cities.forEach(a => {
      this.allCities.push(a);
    });
    this.cities.push({id: 1, value: 'sonounvalue'});
  }

  retrieveRoute() {
    let routeBaseUrl = 'https://maps.googleapis.com/maps/api/directions/json?';
    routeBaseUrl += 'origin=41.9,12.4&destination=51.678418,7.809007';
    routeBaseUrl += '&key=AIzaSyCb2-mkLHWGdDBQAchtHhuQcucgbPNuO-M';
    this.http.options(routeBaseUrl, ).subscribe(data => this.mapRoute(data));
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
