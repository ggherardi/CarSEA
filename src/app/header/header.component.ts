import { Component, OnInit } from '@angular/core';
import { PHPService } from '../common/phpService';
import { Cookies } from '../common/cookies';
import { Models } from '../common/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  user: any; // this.models; // this.models.userModel;
  logged = false;
  USER_COOKIE_NAME = 'user';

  constructor(private phpService: PHPService, private cookies: Cookies, private models: Models) { }

  ngOnInit() {
    this.loadSession();
  }

  private loadSession() {
    const storedObject = this.cookies.getObjectFromCookie(this.USER_COOKIE_NAME);
    if (storedObject !== undefined) {
      console.log(storedObject);
      this.user = storedObject;
      this.logged = true;
      // this.user = storedObject;
      // console.log(this.user);
    }
  }

  login(): void {
    const username: string =  jQuery('#login_username').val() as string;
    const password: string = jQuery('#login_password').val() as string;
    const data = {
      action: 'login',
      username: username,
      password: password
    };
    this.phpService.postResponse('php/Authentication.php', data, this.setAuthenticationCookies.bind(this));
  }

  private setAuthenticationCookies(res) {
    const parsedResult = JSON.parse(res);
    if (parsedResult === -1) {
      alert('Attenzione, la password è sbagliata!');
    } else {
      this.cookies.setEncodedCookie(this.USER_COOKIE_NAME, parsedResult, 0.5);
      this.logged = true;
      this.user = parsedResult['Name'];
    }
  }

  logout(): void {
    this.cookies.disposeCookie(this.USER_COOKIE_NAME);
  }
}
