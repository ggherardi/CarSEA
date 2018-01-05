import { Component, Injectable } from '@angular/core';
import { PHPService } from './common/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  testResponse: any;

  constructor(private http: PHPService) {
    const session = sessionStorage.getItem('carsea');
    console.log(session);
  }
}
