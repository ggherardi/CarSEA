import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  get sFormControls() { return this.signupForm.controls; }

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
   }

  createForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', [this.MatchPassword]]
    });
  }

  MatchPassword(AC: AbstractControl) {
    if (AC.pristine) {
      return null;
    }
    const password = AC.parent.get('password').value;
    const confirmPassword =  AC.parent.get('passwordConfirm').value;
    if (password !== confirmPassword) {
      console.log('false');
      AC.setErrors( {MatchPassword: false} );
      // AC.parent.get('password').setErrors( {MatchPassword: false} );
    } else {
      console.log('true');
      return null;
    }
  }

  signup() {
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
    this.app.shared.login(this.signupForm.controls.username.value, this.signupForm.controls.password.value);
    console.log('res: ');
    console.log(JSON.parse(res));
  }
}

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.parent.controls['password'].value;
    const confirmPassword = AC.value;
    if (password !== confirmPassword) {
        console.log('false');
        AC.get('passwordConfirm').setErrors( {MatchPassword: true} );
    } else {
        console.log('true');
        return null;
    }
  }
}
