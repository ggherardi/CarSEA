import { Component, Injectable } from '@angular/core';
import { PhpServiceComponent } from './common/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  testResponse: any;

  constructor(private http: PhpServiceComponent) {
    this.http.getResponse('/php/Session.php').subscribe(data => {
      this.testResponse = data;
      console.log(this.testResponse);
    });
  }
}
