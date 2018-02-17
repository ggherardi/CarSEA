import { Component, OnInit, Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from './httpService';
import { Models, UserModel } from './models';
import { Cookies } from './cookies';
import { GooglemapsService } from './googlemaps.service';
import { ConstantsService } from './constants.service';
import { Observable } from 'rxjs/Observable';

@Component({ })

@Injectable()
export class SharedComponent implements OnInit {
  userLogged = false;

  constructor(public router: Router, public httpService: HttpService, public models: Models,
              public cookies: Cookies, public googleMapsService: GooglemapsService,
              public constantsService: ConstantsService) { }

  ngOnInit() { }

  /** Metodo proxy per chiamare la POST nell'HttpService rivolta alle API interne che
   * necessitano dell'autenticazione tramite il JWT. */
  post = (serviceUrl, data: object): Observable<any[]> => {
    this.getToken();
    return this.httpService.post(serviceUrl, data);
  }

  /** Metodo proxy per chiamare la GET nell'HttpService rivolta alle API interne che
  * necessitano dell'autenticazione tramite il JWT. */
  get = (url: string): Observable<any[]> => {
    this.getToken();
    return this.httpService.get(url);
  }

  login(username: string, password: string, callback: any = function(a){}): void {
    const data = {
      action: 'login',
      username: username,
      password: password
    };
    this.post('php/AuthenticationService.php', data)
        .subscribe(this.setAuthCookiesCallBack.bind(this), err => console.log(err), callback);
    }

  private setAuthCookiesCallBack(data) {
    if (data === -1) {
      alert('Attenzione, le credenziali inserite non sono corrette!');
    } else {
      this.cookies.setEncodedCookie(this.cookies.USER_COOKIE_NAME, data, 0.5);
      this.loadSession();
      this.router.navigateByUrl('myProfile');
    }
  }

  logout() {
    this.cookies.disposeCookie(this.cookies.USER_COOKIE_NAME);
    this.userLogged = false;
    this.models.disposeUserModel();
    this.httpService.JWToken = '';
    this.router.navigateByUrl('/');
  }

  loadSession() {
    const storedUserDetails = this.cookies.getObjectFromCookie(this.cookies.USER_COOKIE_NAME);
    if (storedUserDetails !== undefined) {
      this.models.userModel = storedUserDetails;
      this.userLogged = true;
    }
  }

  getToken() {
    const userCookie: UserModel = this.cookies.getObjectFromCookie(this.cookies.USER_COOKIE_NAME);
    if (userCookie !== undefined) {
      this.httpService.JWToken = userCookie.Token;
    } else {
      this.httpService.JWToken = '';
    }
  }
}
