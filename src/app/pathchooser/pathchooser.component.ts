import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-pathchooser',
  templateUrl: './pathchooser.component.html',
  styleUrls: ['./pathchooser.component.css']
})
export class PathchooserComponent implements OnInit {
  googleMapsAPIKey: 'AIzaSyCb2-mkLHWGdDBQAchtHhuQcucgbPNuO-M';
  res: any;
  constructor(private app: AppComponent, private http: Http) { }

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    const response = this.http.get('http://ipinfo.io').map(this.mapLocation);
    const c = this.http.get('http://ipinfo.io').subscribe(res => this.res = res);
    console.log(response);

  }

  mapLocation(res: Response) {
    const body = res.json();
    return body;
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
}

}
