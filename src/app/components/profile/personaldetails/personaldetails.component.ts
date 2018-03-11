import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiAutocompleteConfig } from '../../shared/apiautocomplete/apiautocomplete.component';
import { Http } from '@angular/http';
import { UserModel, UserDetail } from '../../../_services/models';

@Component({
  selector: 'app-personaldetails',
  templateUrl: './personaldetails.component.html',
  styleUrls: ['./personaldetails.component.css']
})
export class PersonaldetailsComponent implements OnInit {
  @ViewChild('failureModalContent') failureModalContent;
  @ViewChild('successModalContent') successModalContent;
  @ViewChild('fileUpload') fileUpload;
  userId: number;
  personalDetailsForm: FormGroup;
  carsForm: FormGroup;
  makeAutocompleteConfig: ApiAutocompleteConfig = {
    apiUrl: 'php/CarService.php',
    apiAction: 'searchMake',
    formattingFunction: (data) => `${data}`,
    valueFormattingFunction: (data) => `${data.model} (${data.year})`
  };
  modelAutocompleteConfig: ApiAutocompleteConfig = {
    apiUrl: 'php/CarService.php',
    apiAction: 'searchModel',
    formattingFunction: (data) => `${data.model} (${data.year})`,
    valueFormattingFunction: (data) => `${data.model} (${data.year})`
  };

  constructor(private app: AppComponent, private formBuilder: FormBuilder, private http: Http) { }

  ngOnInit() {
    if (!this.loadUser()) {
      this.app.shared.router.navigateByUrl('');
    }
    this.buildForm();
    this.loadUserDetails();
  }

  loadUser() {
    const userObj: UserModel = this.app.shared.cookies.getObjectFromCookie(this.app.shared.cookies.USER_COOKIE_NAME);
    this.userId = userObj !== undefined ? userObj.UserID : undefined;
    return userObj !== undefined;
  }

  buildForm() {
    this.personalDetailsForm = this.formBuilder.group({
      name: '',
      surname: '',
      email: '',
      age: '',
      description: '',
      profilePicture: '',
    });
    this.carsForm = this.formBuilder.group({
      make: '',
      model: ''
    });
  }

  loadUserDetails() {
    this.app.shared.loadUserDetals(this.userId).subscribe(
      succ => console.log(succ),
      err => console.log(err)
    );
  }

  profilePictureChange(event) {
    // console.log(event.target.files[0]);
    // const data = {
    //   action: 'insertDetails',
    //   profilePicture: event.target.files[0]
    // };
    // this.app.shared.post('php/PeopleDetailService.php', data).subscribe(succ => console.log(succ), err => console.log(err));
    const file: File = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('profilePicture', file);
    formData.append('action', 'insertProfilePicture');
    this.http.post('php/PeopleDetailService.php', formData).map(res => res.json())
    .subscribe(
        data => console.log('success'),
        error => console.log(error)
    );
  }

  saveDetails(form: FormGroup) {
    const userObj: UserModel = this.app.shared.cookies.getObjectFromCookie(this.app.shared.cookies.USER_COOKIE_NAME);
    if (userObj === undefined) {
      this.app.shared.openModal(this.failureModalContent);
      return;
    }
    const userDetails = new UserDetail(
      userObj.UserID,
      form.get('name').value,
      form.get('surname').value,
      form.get('email').value,
      form.get('age').value,
      form.get('description').value,
    );
    const data = {
      action: 'insertDetails',
      userDetails: JSON.stringify(userDetails)
    };
    this.app.shared.post('php/PeopleDetailService.php', data).subscribe(
      succ => this.app.shared.openModal(this.successModalContent),
      err => console.log(err)
    );
  }
}
