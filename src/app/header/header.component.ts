import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, DoCheck {

  user: any;
  logged = false;
  loginForm: FormGroup;

  ngDoCheck () {
    this.app.shared.loadSession();
    this.populateView();
  }

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.app.shared.loadSession();
    this.populateView();
    this.buildForm();
  }

  private populateView () {
    this.user = this.app.shared.models.userModel;
    this.logged = this.app.shared.userLogged;
  }

  private buildForm(username: string = '', password: string = '') {
    this.loginForm = this.formBuilder.group({
      username: username,
      password: password
    });
  }

  homepage(): void {
    this.app.router.navigateByUrl('/');
  }

  signup(): void {
    this.app.router.navigateByUrl('signup');
  }

  loginFromForm(): void {
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    this.app.shared.login(username, password, this.callbackClearForm.bind(this));
  }

  logoutFromForm(): void {
    this.app.shared.logout();
  }

  // Callback per pulire il form di login una volta che questo è stato effettuato
  callbackClearForm(res) {
    console.log(res);
    const parsedRes = JSON.parse(res);
    if (parsedRes === -1) {
      this.buildForm(this.loginForm.get('username').value, '');
    } else {
      this.buildForm();
    }
  }
}
