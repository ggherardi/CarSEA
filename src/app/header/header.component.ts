import { Component, OnInit } from '@angular/core';
import { PHPService } from '../common/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  constructor(private http: PHPService) { }

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
    const promise = this.http.postResponse('php/Authentication.php', data);
    promise.done(function(res){
      if (JSON.parse(res) === -1) {
        alert('Attenzione, la password è sbagliata!');
      } else {
        sessionStorage.setItem('carseaSession', res);
      }
    });

  }

  logout(): void {
    sessionStorage.removeItem('carseaSession');
  }
}
