import { Component, OnInit } from '@angular/core';
import { PHPService } from '../_common/phpService';
import { Cookies } from '../_common/cookies';
import { Models } from '../_common/models';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  user: any; // this.models; // this.models.userModel;
  logged = false;
  USER_COOKIE_NAME = 'user';

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.loadSession();
  }

  private loadSession() {
    const storedUserDetails = this.app.cookies.getObjectFromCookie(this.USER_COOKIE_NAME);
    if (storedUserDetails !== undefined) {
      console.log(storedUserDetails);
      this.user = storedUserDetails;
      this.logged = true;
      this.app.models.userModel = storedUserDetails;
    }
  }

  homepage(): void {
    this.app.router.navigateByUrl('/');
  }

  signup(): void {
    this.app.router.navigateByUrl('signup');
  }

  loginFromForm(): void {
    const username: string =  jQuery('#login_username').val() as string;
    const password: string = jQuery('#login_password').val() as string;
    this.login(username, password);
  }

  login(username: string, password: string): void {
    const data = {
      action: 'login',
      username: username,
      password: password
    };
    this.app.phpService.postResponse('php/Authentication.php', data, this.setAuthCookiesCallBack.bind(this));
  }

  private setAuthCookiesCallBack(res) {
    const parsedResult = JSON.parse(res);
    if (parsedResult === -1) {
      alert('Attenzione, la password è sbagliata!');
    } else {
      this.app.cookies.setEncodedCookie(this.USER_COOKIE_NAME, parsedResult, 0.5);
      this.loadSession();
      this.app.router.navigateByUrl('myProfile');
    }
  }

  logout(): void {
    this.app.cookies.disposeCookie(this.USER_COOKIE_NAME);
    this.logged = false;
    this.app.router.navigateByUrl('/');
  }
}
