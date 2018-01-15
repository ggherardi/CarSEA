import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  data: any;

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.data = { Name: 'pippo' };
  }

  signup() {
    console.log(this.data.Name);
    const username: string =  jQuery('#login_username').val() as string;
    const password: string = jQuery('#login_password').val() as string;
    const data = {
      action: 'signup',
      username: username,
      password: password
    };
    this.app.phpService.postResponse('php/Authentication.php', data, this.setAuthCookiesCallBack.bind(this));
  }

  private setAuthCookiesCallBack(res) {
    
  }
}
