import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Trip, SearchFilters, TripResponse } from '../../../_services/models';
import { List } from '../../../_services/utilities.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaginatePipe, PaginationControlsComponent } from 'ng2-pagination';
import { timeout } from 'q';

@Component({
  selector: 'app-findpassage',
  templateUrl: './findpassage.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./findpassage.component.css?ver=${new Date().getTime()}']
})
export class FindpassageComponent implements OnInit {
  storedTrips: List<TripResponse> = List.create<TripResponse>();
  allTrips: List<TripResponse> = List.create<TripResponse>();
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
    connect: true,
    step: 1,
    start: [0]
  };

  constructor(private app: AppComponent, private formBuilder: FormBuilder) { }

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.allTrips.push(JSON.parse(`{"ownerId":"3","ownerName":"pollpo","tripId":"24","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":null,"waypointCityName":null}`));
    }
    for (let i = 0; i < 100; i++) {
      this.allTrips.push(JSON.parse(`{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"50","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"7169","waypointCityName":"Senigallia","allWaypoints":[{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"7169","waypointCityName":"Senigallia"},{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"5625","waypointCityName":"Pesaro"},{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"3316","waypointCityName":"Fano"}, {"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"7169","waypointCityName":"Senigallia"},{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"5625","waypointCityName":"Pesaro"}, {"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"7169","waypointCityName":"Senigallia"},{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"5625","waypointCityName":"Pesaro"}]}`));
    }
    this.storedTrips = this.allTrips.copy();
    this.maxPrice = Math.max.apply(Math, this.storedTrips.map(t => t.price));
    this.selectedPrice = this.maxPrice;
    this.initControls();
    this.buildForm();
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

  private dateChange(event) {
    this.app.showSpinnerLoader = true;
    setTimeout(this.getTrips.bind(this), 250);
  }

  private getTrips() {
    const stringifiedFilters = this.gatherStringifyFilters();
    if (!stringifiedFilters) {
      alert('Selezionare una città di partenza e una di arrivo');
      this.app.showSpinnerLoader = false;
      return;
    }
    this.app.showSpinnerLoader = true;
    const data = {
      action: 'getTrips',
      filters: stringifiedFilters
    };
    this.app.shared.post('php/tripservice.php', data).subscribe(this.setAllTrips.bind(this), err => console.log(err));
  }

  private timeChange(event) {
    this.startTime = event[0];
    this.endTime = event[1];
    this.applyClientFilters();
    // this.applyClientFilters(trip => {
    //   console.log(`${trip.departureDate} < ${this.getFilterDate()[0]} ? ${trip.departureDate < this.getFilterDate()[0]}`);
    //   console.log(`${trip.departureDate} > ${this.getFilterDate()[1]} ? ${trip.departureDate < this.getFilterDate()[1]}`);
    //   return trip.departureDate < this.getFilterDate()[0] && trip.departureDate > this.getFilterDate()[1];
    // });
  }

  private priceChange(event) {
    this.selectedPrice = event;
    this.applyClientFilters();
    // this.applyClientFilters(trip => trip.price > this.selectedPrice);
  }

  /** Rimuove dalla lista dei Trip gli item che soddisfano la condizione passata come argomento */
  private applyClientFilters() {
    const tempTrips: List<TripResponse> = this.storedTrips.copy();
    const dateCondition = trip => trip.departureDate < this.getFilterDate()[0] && trip.departureDate > this.getFilterDate()[1];
    const priceCondition = trip => trip.price > this.selectedPrice;
    tempTrips.remove(priceCondition);
    tempTrips.remove(dateCondition);
    this.allTrips = tempTrips.copy();
  }

  private gatherStringifyFilters(): string {
    let departureCity = this.filtersFormGroup.get('departureCityPicker').value;
    let arrivalCity = this.filtersFormGroup.get('arrivalCityPicker').value;
    if (!departureCity && !arrivalCity) {
      return '';
    }
    departureCity = departureCity.id;
    arrivalCity = arrivalCity.id;

    const filters = new SearchFilters(
      departureCity,
      arrivalCity,
      this.filtersFormGroup.get('pricePicker').value,
      this.getFilterDate()[0],
      this.getFilterDate()[1]
    );
    return JSON.stringify(filters);
  }

  private setAllTrips(data: any) {
    console.log(data);
    this.app.showSpinnerLoader = false;
    const castedData: List<TripResponse> = List.createFromArray<TripResponse>(data);
    if (data.length > 0) {
      const resultsMaxPrice = Math.max.apply(Math, data.map(t => t.price));
      this.maxPrice = resultsMaxPrice > 0 ? resultsMaxPrice : 500;
      this.selectedPrice = this.maxPrice;
    }
    this.storedTrips = castedData.copy();
    this.allTrips = this.storedTrips.copy();
  }

  private getFilterDate(): string[] {
    const time = this.filtersFormGroup.get('timePicker').value;
    const date = this.filtersFormGroup.get('datePicker').value;
    const formattedStartDate = this.formatDate(date, time[0]);
    const formattedEndDate =  this.formatDate(date, time[1]);
    return [formattedStartDate, formattedEndDate];
  }

  private formatDate(date: any, time: any): string {
    const month = date.month < 10 ? `0${date.month}` : date.month;
    const day = date.day < 10 ? `0${date.day}` : date.day;
    time = time >= 10 ? time : (`0${time}`).slice(0, 2);
    return `${date.year}-${month}-${day} ${time}:00`;
  }
}
