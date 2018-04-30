import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { ApiAutocompleteConfig } from '../../shared/apiautocomplete/apiautocomplete.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./body.component.css?ver=${new Date().getTime()}']
})
export class BodyComponent implements OnInit {
  tripSearch: FormGroup;
  startTime = 0;
  endTime = 24;
  autocompleteConfig: ApiAutocompleteConfig = {
    apiUrl: 'php/CitiesService.php',
    apiAction: 'search',
    formattingFunction: (data) => `${data['id_regione']} - ${data['value']}`,
    valueFormattingFunction: (data) => `${data.value}`
  };
  timePickerConfig = {
    connect: true,
    step: 1,
    start: [this.startTime, this.endTime]
  };

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    const date = new Date();
    const today = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.tripSearch = this.formBuilder.group({
      departureCityPicker: [''],
      arrivalCityPicker: [''],
      timePicker: [[0, 24]],
      datePicker: [today]
    });
  }
}
