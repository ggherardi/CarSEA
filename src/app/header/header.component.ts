import { Component, OnInit } from '@angular/core';
import { PHPService } from '../common/api';
import { Cookies } from '../common/cookies';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  constructor(private http: PHPService, private cookies: Cookies) { }

  ngOnInit() {
  }

  login(): void {
    const username: string =  jQuery('#login_username').val() as string;
    const password: string = jQuery('#login_password').val() as string;
    const data = {
      action: 'login',
      username: username,
      password: password
    };
    this.http.postResponse('php/Authentication.php', data, this.setAuthenticationCookies.bind(this));
  }

  setAuthenticationCookies(res) {
    if (JSON.parse(res) === -1) {
      alert('Attenzione, la password è sbagliata!');
    } else {
      this.cookies.setCookie('user', JSON.parse(res), 0.5);
      sessionStorage.setItem('carseaSession', res);
    }
  }

  logout(): void {
    sessionStorage.removeItem('carseaSession');
  }
}
