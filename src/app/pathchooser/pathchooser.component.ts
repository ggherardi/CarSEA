import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { MapsAPILoader } from '@agm/core/services/maps-api-loader/maps-api-loader';
import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-pathchooser',
  templateUrl: './pathchooser.component.html',
  styleUrls: ['./pathchooser.component.css']
})
export class PathchooserComponent implements OnInit, DoCheck {
  map = new Map(0, 0);
  res: any;

  constructor(private app: AppComponent, private http: Http) { }

  ngOnInit() {
    this.getCurrentLocation();
    // this.retrieveRoute();
  }

  ngDoCheck () {

  }

  getCurrentLocation() {
    this.http.get('http://ipinfo.io/json').subscribe(data => this.mapLocation(data));
  }

  mapLocation(data) {
    if (data !== undefined) {
      const location = data.json().loc.split(',');
      this.map.lat = Number(location[0]);
      this.map.lng = Number(location[1]);
      console.log(this.map);
    }
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
