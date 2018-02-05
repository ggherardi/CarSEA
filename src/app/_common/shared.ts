import { Component, OnInit, Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from './httpService';
import { Models } from './models';
import { Cookies } from './cookies';

@Component({ })

@Injectable()
export class SharedComponent implements OnInit {
  userLogged = false;

  constructor(public router: Router, public httpService: HttpService, public models: Models,
              public cookies: Cookies) { }

  ngOnInit() { }

  login(username: string, password: string, callback: any = function(){}): void {
    const data = {
      action: 'login',
      username: username,
      password: password
    };
    this.httpService.postResponse('php/Authentication.php', data, this.setAuthCookiesCallBack.bind(this), callback);
    }

  private setAuthCookiesCallBack(res) {
    const parsedResult = JSON.parse(res);
    if (parsedResult === -1) {
      alert('Attenzione, le credenziali inserite non sono corrette!');
    } else {
      this.cookies.setEncodedCookie(this.cookies.USER_COOKIE_NAME, parsedResult, 0.5);
      this.loadSession();
      this.router.navigateByUrl('myProfile');
    }
  }

  logout() {
    this.cookies.disposeCookie(this.cookies.USER_COOKIE_NAME);
    this.userLogged = false;
    this.models.disposeUserModel();
    this.router.navigateByUrl('/');
  }

  loadSession() {
    const storedUserDetails = this.cookies.getObjectFromCookie(this.cookies.USER_COOKIE_NAME);
    if (storedUserDetails !== undefined) {
      this.models.userModel = storedUserDetails;
      this.userLogged = true;
    }
  }
}
