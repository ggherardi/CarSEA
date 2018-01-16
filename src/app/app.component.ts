import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PHPService } from './_common/phpService';
import { Models } from './_common/models';
import { Cookies } from './_common/cookies';
import { ReactiveFormsModule } from '@angular/forms';


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

  constructor(public phpService: PHPService, public cookies: Cookies, public models: Models,
              public router: Router) {

  }
}
