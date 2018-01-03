import { Component, OnInit } from '@angular/core';
import { PhpServiceComponent } from '../common/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  constructor(private http: PhpServiceComponent) { }

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
    // promise.progress(function(){ console.log('.'); });
    promise.then(function(res){ console.log(res); });
  }

  logout(): void {
    const data = { action: 'logout' };
    this.http.postResponse('php/Authentication.php', data);
  }
}
