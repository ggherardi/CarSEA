import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './_services/httpService';
import { Models } from './_services/models';
import { Cookies } from './_services/cookies';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponent } from './_services/shared';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    Models
  ]
})

export class AppComponent {
  title = 'app';
  testResponse: any;

  constructor(public cookies: Cookies, public models: Models, public router: Router, public shared: SharedComponent) {

  }
}
