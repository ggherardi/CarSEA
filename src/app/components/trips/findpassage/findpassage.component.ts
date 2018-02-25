import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Trip } from '../../../_services/models';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-findpassage',
  templateUrl: './findpassage.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./findpassage.component.css?ver=${new Date().getTime()}']
})
export class FindpassageComponent implements OnInit {
  allTrips: Trip[] = [];
  startTime = 0;
  endTime = 24;
  filtersFormGroup: FormGroup;
  timePickerConfig = {
    connect: true,
    step: 1,
    start: [this.startTime, this.endTime]
  };

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.allTrips.push(new Trip(1, 2, 3, 4, 5, 6, 7, 8, ''));
  }

  private buildForm() {
    const date = new Date();
    const today = {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };
    this.filtersFormGroup = this.formBuilder.group({
      departureCityPicker: [''],
      arrivalCityPicker: [''],
      timePicker: [[0, 24]],
      datePicker: [today]
    });
  }

  private timeChange(event) {
    this.startTime = event[0];
    this.endTime = event[1];
  }

  private getTrip() {
    console.log(this.filtersFormGroup.get('departureCityPicker').value);
    console.log(this.filtersFormGroup.get('arrivalCityPicker').value);
    console.log(this.filtersFormGroup.get('timePicker').value);
    console.log(this.filtersFormGroup.get('datePicker').value);
    // this.app.shared.post('php/tripservice.php', null).subscribe();
  }

  cityChanged(event) {
    console.log(this.filtersFormGroup.get('departureCityPicker').value);
  }
}
