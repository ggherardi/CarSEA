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
  maxPrice = 500;
  selectedPrice = 0;
  startTime = 0;
  endTime = 24;
  filtersFormGroup: FormGroup;
  timePickerConfig = {
    connect: true,
    step: 1,
    start: [this.startTime, this.endTime]
  };
  pricePickerConfig = {
    range: {
      max: 500,
      min: 0
    },
    connect: true,
    step: 1,
    start: [0]
  };

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initControls();
    this.buildForm();
    this.allTrips.push(new Trip(1, 2, [1, 2], 7, 8, ''));
  }

  private initControls() {
    this.selectedPrice = this.maxPrice;
  }

  private buildForm() {
    const date = new Date();
    const today = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.filtersFormGroup = this.formBuilder.group({
      departureCityPicker: [''],
      arrivalCityPicker: [''],
      timePicker: [[0, 24]],
      datePicker: [today],
      pricePicker: [this.maxPrice]
    });
  }

  private timeChange(event) {
    this.startTime = event[0];
    this.endTime = event[1];
  }

  private priceChange(event) {
    this.selectedPrice = event;
  }

  private getTrip() {
    const stringifiedFilters = this.gatherStringifyFilters();
    const data = {
      action: 'getTrips',
      filters: stringifiedFilters
    };
    this.app.shared.post('php/tripservice.php', data).subscribe(succ => console.log(succ), err => console.log(err));
  }

  private gatherStringifyFilters(): string {
    let departureCity = this.filtersFormGroup.get('departureCityPicker').value;
    departureCity = departureCity.id;
    let arrivalCity = this.filtersFormGroup.get('arrivalCityPicker').value;
    arrivalCity = arrivalCity.id;
    const time = this.filtersFormGroup.get('timePicker').value;
    const date = this.filtersFormGroup.get('datePicker').value;
    const formattedStartDate = this.formatDate(date, time[0]);
    const formattedEndDate =  this.formatDate(date, time[1]);

    const filters = new SearchFilters(
      departureCity,
      arrivalCity,
      this.filtersFormGroup.get('pricePicker').value,
      formattedStartDate,
      formattedEndDate
    );

    return JSON.stringify(filters);
  }

  private formatDate(date: any, time: any): string {
    const month = date.month < 10 ? `0${date.month}` : date.month;
    time = (`${time}0`).slice(0, 2);
    return `${date.year}-${month}-${date.day} ${time}:00`;
  }

  cityChanged(event) {
    console.log(this.filtersFormGroup.get('departureCityPicker').value);
  }
}
