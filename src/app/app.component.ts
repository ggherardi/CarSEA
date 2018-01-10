import { Component, Injectable } from '@angular/core';
import { PHPService } from './common/phpService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ PHPService ]
})

export class AppComponent {
  title = 'app';
  testResponse: any;

  constructor(private http: PHPService) {

  }
}
