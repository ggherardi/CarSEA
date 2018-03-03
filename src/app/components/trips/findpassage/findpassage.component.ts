import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Trip, SearchFilters, TripResponse, List } from '../../../_services/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaginatePipe, PaginationControlsComponent } from 'ng2-pagination';

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
    // this.encodeHiddenTrips();
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
    this.getTrips();
  }

  private timeChange(event) {
    this.startTime = event[0];
    this.endTime = event[1];
    const tempAllTrips = this.allTrips.slice();

    // const tempAllTrips = this.decodeHiddenTrips();
  }

  private priceChange(event) {
    this.selectedPrice = event;
    const tempTrips: List<TripResponse> = this.storedTrips.copy();
    tempTrips.remove(t => t.price > this.selectedPrice);
    // for (let i = 0; i < tempTrips.length; i++) {
    //   if (tempTrips[i].price > this.selectedPrice) {
    //     tempTrips.splice(i, 1);
    //   }
    // }
    // let i = 0;
    // while (i < tempTrips.length) {
    //   if (tempTrips[i].price > this.selectedPrice) {
    //     tempTrips.splice(i, 1);
    //   } else {
    //     i++;
    //   }
    // }
    this.allTrips = tempTrips.copy();
  }

  private getTrips() {
    const stringifiedFilters = this.gatherStringifyFilters();
    if (!stringifiedFilters) {
      alert('Selezionare una città di partenza e una di arrivo');
      return;
    }
    const data = {
      action: 'getTrips',
      filters: stringifiedFilters
    };
    this.app.shared.post('php/tripservice.php', data).subscribe(this.setAllTrips.bind(this), err => console.log(err));
  }

  private gatherStringifyFilters(): string {
    let departureCity = this.filtersFormGroup.get('departureCityPicker').value;
    let arrivalCity = this.filtersFormGroup.get('arrivalCityPicker').value;
    if (!departureCity && !arrivalCity) {
      return '';
    }
    departureCity = departureCity.id;
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

  private setAllTrips(data: List<TripResponse>) {
    console.log(data);
    if (data.length > 0) {
      const resultsMaxPrice = Math.max.apply(Math, data.map(t => t.price));
      this.maxPrice = resultsMaxPrice > 0 ? resultsMaxPrice : 500;
      this.selectedPrice = this.maxPrice;
    }
    this.storedTrips = data;
    this.allTrips = this.storedTrips.copy();
    // this.encodeHiddenTrips();
  }

  // private encodeHiddenTrips() {
  //   const stringifiedAllTrip = JSON.stringify(this.allTrips);
  //   this.hiddenAllTrips = atob(stringifiedAllTrip);
  // }

  // private decodeHiddenTrips() {

  // }

  private formatDate(date: any, time: any): string {
    const month = date.month < 10 ? `0${date.month}` : date.month;
    time = time >= 10 ? time : (`0${time}`).slice(0, 2);
    return `${date.year}-${month}-${date.day} ${time}:00`;
  }

  cityChanged(event) {
    console.log(this.filtersFormGroup.get('departureCityPicker').value);
  }
}
