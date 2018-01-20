import { Component, OnInit, Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../header/header.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PHPService } from './phpService';
import { Models } from './models';
import { Cookies } from './cookies';

@Component({ })

@Injectable()
export class SharedComponent implements OnInit {
    USER_COOKIE_NAME = 'user';
    userLogged = false;

    constructor(public router: Router, public phpService: PHPService, public models: Models,
                public cookies: Cookies) { }

    ngOnInit() { }

    login(username: string, password: string): void {
        const data = {
          action: 'login',
          username: username,
          password: password
        };
        this.phpService.postResponse('php/Authentication.php', data, this.setAuthCookiesCallBack.bind(this));
      }

      private setAuthCookiesCallBack(res) {
          const parsedResult = JSON.parse(res);
          if (parsedResult === -1) {
            alert('Attenzione, la password è sbagliata!');
          } else {
            this.cookies.setEncodedCookie(this.USER_COOKIE_NAME, parsedResult, 0.5);
            this.loadSession();
            this.router.navigateByUrl('myProfile');
          }
      }

      loadSession() {
        const storedUserDetails = this.cookies.getObjectFromCookie(this.USER_COOKIE_NAME);
        if (storedUserDetails !== undefined) {
            console.log(storedUserDetails);
            this.models.userModel = storedUserDetails;
            this.userLogged = true;
        }
      }
}
