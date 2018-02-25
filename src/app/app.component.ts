import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './_services/httpService';
import { Models } from './_services/models';
import { Cookies } from './_services/cookies';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponent } from './_services/shared';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./app.component.css?ver=${new Date().getTime()}'],
  providers: [
    Models
  ]
})

export class AppComponent implements OnInit {
  title = 'app';
  testResponse: any;

  constructor(public cookies: Cookies, public router: Router, public shared: SharedComponent) {

  }

  ngOnInit() {
    this.shared.loadSession();
  }
}
