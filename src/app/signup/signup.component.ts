import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { AbstractControl } from '@angular/forms/src/model';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  signupError = 0;

  get sFormControls() { return this.signupForm.controls; }

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
   }

  private createForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(4)]]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  private signup() {
    const data = {
      action: 'signup',
      name: this.signupForm.controls.name.value,
      surname: this.signupForm.controls.surname.value,
      email: this.signupForm.controls.email.value,
      username: this.signupForm.controls.username.value,
      password: this.signupForm.controls.password.value
    };
    this.app.shared.phpService.postResponse('php/Authentication.php', data, this.signupCallBack.bind(this));
  }

  private signupCallBack(res) {
    const signupResult = JSON.parse(res);
    console.log('res: ' + signupResult);
    this.signupError = signupResult;
    if (signupResult === 0) {
      this.app.shared.login(this.signupForm.controls.username.value, this.signupForm.controls.password.value);
    }
  }
}

export class PasswordValidation {

  static MatchPassword(AC: FormGroup) {
    const password = AC.get('password');
    const confirmPassword =  AC.get('passwordConfirm');
    if (!password || !confirmPassword) {
      return null;
    }
    if (password.value !== confirmPassword.value) {
      return {MatchPassword: false};
    } else {
      return null;
    }
  }
}
