import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./header.component.css?ver=${new Date().getTime()}']
})

export class HeaderComponent implements OnInit, DoCheck {

  showSpinnerLoader = false;
  user: any;
  logged = false;
  loginForm: FormGroup;

  ngDoCheck () {
    // this.app.shared.loadSession();
    this.populateView();
  }

  constructor(private app: AppComponent, private formBuilder: FormBuilder,
    ddlConfig: NgbDropdownConfig) {
      ddlConfig.autoClose = 'outside';
    }

  ngOnInit() {
    console.log('test');
    // this.app.shared.loadSession();
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

  loginFromForm(form: FormGroup): void {
    const username = form.get('username').value;
    const password = form.get('password').value;
    this.showSpinnerLoader = true;
    this.app.shared.login(username, password, this.callbackClearForm.bind(this));
  }

  logoutFromForm(): void {
    this.app.shared.logout();
  }

  // Callback per pulire il form di login una volta che questo è stato effettuato
  callbackClearForm() {
    this.showSpinnerLoader = false;
    if (!this.app.shared.userLogged) {
      this.buildForm(this.loginForm.get('username').value, '');
    } else {
      this.buildForm();
    }
  }
}
