import { Component, Injectable } from '@angular/core';
import { PHPService } from './_common/phpService';
import { Models } from './_common/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    PHPService,
    Models ]
})

export class AppComponent {
  title = 'app';
  testResponse: any;

  constructor(private http: PHPService) {

  }
}
