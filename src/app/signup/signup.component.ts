import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private app: AppComponent, private formBuilder: FormBuilder) {
    this.createForm();
   }

  ngOnInit() { }

  createForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: '',
      email: '',
      password: '',
    });
  }

  onSubmit() {
    console.log();
    const username: string =  jQuery('#login_username').val() as string;
    const password: string = jQuery('#login_password').val() as string;
    const data = {
      action: 'signup',
      username: username,
      password: password
    };
    // this.app.phpService.postResponse('php/Authentication.php', data, this.setAuthCookiesCallBack.bind(this));
  }

  private setAuthCookiesCallBack(res) {
    
  }
}
