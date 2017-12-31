import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  login(): void {
    const username: string =  jQuery('#login_username').val() as string;
    const password: string = jQuery('#login_password').val() as string;
    jQuery.ajax({
        url: '/lib/Authentication.php',
        data: {action: 'login', username: username, password: password},
        method: 'post',
        success: this.LoginSuccess,
        error: this.LoginFailure
    });
  }

  logout(): void {
    jQuery.ajax({
        url: '/lib/Authentication.php',
        data: {action: 'logout'},
        method: 'post',
        success: this.LoginSuccess,
        error: this.LoginFailure
    });
  }


  private LoginSuccess(data: any): void {
    console.log(data);
  }

  private LoginFailure(data: any): void {
      console.log(data.statusText);
  }

}
