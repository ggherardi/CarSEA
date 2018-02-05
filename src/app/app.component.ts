import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './_common/httpService';
import { Models } from './_common/models';
import { Cookies } from './_common/cookies';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponent } from './_common/shared';


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

  constructor(public httpService: HttpService, public cookies: Cookies, public models: Models,
              public router: Router, public shared: SharedComponent) {

  }
}
