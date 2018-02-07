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
export class PathchooserComponent implements OnInit, DoCheck {

  formGroup: FormGroup;
  map = new Map(0, 0);
  res: any;
  cities: any = [];
  allCities: City[] = [];

  searchCities = (keyword: any): Observable<any[]> => {
    const searchKey = this.formGroup.get('searchKey').value;
    const serviceUrl = 'php/CitiesServices.php';
    const data = {
      action: 'search',
      searchKey: searchKey
    };

    this.http.post('php/CitiesServices.php', data).map(r =>  r).subscribe(a => console.log(a));
    return this.http.post('php/CitiesServices.php', data).map(r =>  r.json());
  }


  constructor(private app: AppComponent, private http: Http, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getCurrentLocation();
    this.formGroup = this.formBuilder.group({ searchKey: '' });
    // this.retrieveRoute();
  }

  ngDoCheck () {

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

  searchCities2() {
    const searchKey = this.formGroup.get('searchKey').value;
    const serviceUrl = 'php/CitiesServices.php';
    const data = {
      action: 'search',
      searchKey: searchKey
    };
    const opt = 'action=search';
    // this.app.shared.httpService.postResponse(serviceUrl, data, this.searchCitiesCallback.bind(this));
    const httpOptions = new RequestOptions({
      headers: new Headers({
        // 'Content-type': 'application/x-www-form-urlencoded',
        // 'Cache-Control': 'no-cache',
        // 'Accept': '*/*',
        // 'X-Requested-With': 'XMLHttpRequest'
      })
    });
    // return this.http.post('php/test.php', opt, httpOptions).map(r => r.json());
    this.app.shared.httpService.postResponse('php/CitiesServices.php', opt, this.searchCitiesCallback);
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
