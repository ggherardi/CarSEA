import { Component, OnInit } from '@angular/core';
import { PHPService } from '../_common/phpService';
import { Cookies } from '../_common/cookies';
import { Models } from '../_common/models';
import { AppComponent } from '../app.component';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, DoCheck {

  user: any;
  logged = false;

  ngDoCheck () {
    this.populateView();
  }

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.app.shared.loadSession();
    this.populateView();
  }

  private populateView () {
    this.user = this.app.shared.models.userModel;
    this.logged = this.app.shared.userLogged;
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
    this.app.shared.login(username, password);
  }

  logout(): void {
    this.app.shared.cookies.disposeCookie(this.app.shared.USER_COOKIE_NAME);
    this.app.shared.userLogged = false;
    this.logged = false;
    this.app.router.navigateByUrl('/');
  }
}
