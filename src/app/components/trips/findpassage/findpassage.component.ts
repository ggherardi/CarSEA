import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Trip, SearchFilters } from '../../../_services/models';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-findpassage',
  templateUrl: './findpassage.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./findpassage.component.css?ver=${new Date().getTime()}']
})
export class FindpassageComponent implements OnInit {
  allTrips: Trip[] = [];
  maxPrice = 0;
  minPrice = 0;
  startTime = 0;
  endTime = 24;
  filtersFormGroup: FormGroup;
  timePickerConfig = {
    connect: true,
    step: 1,
    start: [this.startTime, this.endTime],
    padding: [1, 1]
  };
  pricePickerConfig = {
    connect: true,
    step: 1,
    start: [0],
    padding: [1, 1]
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
      datePicker: [today],
      pricePicker: [0]
    });
  }

  private timeChange(event) {
    this.startTime = event[0];
    this.endTime = event[1];
  }

  private priceChange(event) {
    
  }

  private getTrip() {
    console.log(this.filtersFormGroup.get('departureCityPicker').value);
    console.log(this.filtersFormGroup.get('arrivalCityPicker').value);
    const time = this.filtersFormGroup.get('timePicker').value;
    const date = this.filtersFormGroup.get('datePicker').value;
    const formattedStartDate = this.formatDate(date, time[0]);
    const formattedEndDate =  this.formatDate(date, time[1]);
    console.log(formattedStartDate);
    console.log(formattedEndDate);
    const filters = new SearchFilters(
      this.filtersFormGroup.get('departureCityPicker').value,
      this.filtersFormGroup.get('arrivalCityPicker').value,
      this.filtersFormGroup.get('pricePicker').value,
      formattedStartDate,
      formattedEndDate
    );
    // this.app.shared.post('php/tripservice.php', filters).subscribe(succ => console.log(succ), err => console.log(err));
  }

  private formatDate(date: any, time: any): string {
    time = (`${time}0`).slice(0, 2);
    return `${date.day}-${date.month}-${date.year} ${time}:00`;
  }

  cityChanged(event) {
    console.log(this.filtersFormGroup.get('departureCityPicker').value);
  }
}
