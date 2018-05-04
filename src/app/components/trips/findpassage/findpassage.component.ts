import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Trip, SearchFilters, TripResponse } from '../../../_services/models';
import { List } from '../../../_services/utilities.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PaginatePipe, PaginationControlsComponent } from 'ng2-pagination';
import { timeout } from 'q';
import { ApiAutocompleteConfig } from '../../shared/apiautocomplete/apiautocomplete.component';

@Component({
  selector: 'app-findpassage',
  templateUrl: './findpassage.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./findpassage.component.css?ver=${new Date().getTime()}']
})
export class FindpassageComponent implements OnInit {
  autocompleteConfig: ApiAutocompleteConfig = {
    apiUrl: 'php/CitiesService.php',
    apiAction: 'search',
    formattingFunction: (data) => `${data['id_regione']} - ${data['value']}`,
    valueFormattingFunction: (data) => `${data.value}`
  };
  storedTrips: List<TripResponse> = List.create<TripResponse>();
  allTrips: List<TripResponse> = List.create<TripResponse>();
  maxPrice = 500;
  selectedPrice = 0;
  changeTimeEvent: any[];
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
    // for (let i = 0; i < 100; i++) {
    //   this.allTrips.push(JSON.parse(`{"ownerId":"45","ownerName":"prova","tripId":"34","departureDate":"2018-05-31 15:00:00","price":"45","seats":"3","duration":"12873","distance":"213073","departureCityName":"Milano","arrivalCityName":"Genova","waypointId":null,"waypointCityName":null}`));
    //   this.allTrips.push(JSON.parse(`{"ownerId":"44","ownerName":"username1","tripId":"73","departureDate":"2018-05-31 15:00:00","price":"45","seats":"3","duration":"12873","distance":"213073","departureCityName":"Milano","arrivalCityName":"Genova","waypointId":null,"waypointCityName":null}`));
    // }
    // for (let i = 0; i < 100; i++) {
    //   this.allTrips.push(JSON.parse(`{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"50","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"7169","waypointCityName":"Senigallia","allWaypoints":[{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"7169","waypointCityName":"Senigallia"},{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"5625","waypointCityName":"Pesaro"},{"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"3316","waypointCityName":"Fano"}, {"ownerId":"3","ownerName":"pollpo","tripId":"32","departureDate":"2018-03-18 09:00:00","price":"10","seats":"5","duration":"10478","distance":"208252","departureCityName":"Rimini","arrivalCityName":"Recanati","waypointId":"7169","waypointCityName":"Senigallia"}]}`));
    // }
    // this.storedTrips = this.allTrips.copy();
    this.maxPrice = Math.max.apply(Math, this.storedTrips.map(t => t.price));
    this.selectedPrice = this.maxPrice;
    this.initControls();
    this.buildForm();
    if (this.app.shared.storage.searchFilters) {
      this.getTripsWithFilters(this.app.shared.storage.searchFilters);
      this.app.shared.storage.searchFilters = null;
    }
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

  private getTrips(e) {
    const filters = this.gatherStringifyFilters();
    this.getTripsWithFilters(filters);
  }

  private getTripsWithFilters(filters: SearchFilters) {
    if (!filters) {
      alert('Selezionare una città di partenza e una di arrivo');
      this.app.showSpinnerLoader = false;
      return;
    }
    this.app.showSpinnerLoader = true;
    this.app.api.getTripsWithFilters(filters).subscribe(
      this.setAllTrips.bind(this),
      err => {
        console.log(err);
        this.app.showSpinnerLoader = false;
      });
  }

  private timeChange(event) {
    this.startTime = event[0];
    this.endTime = event[1];
    this.changeTimeEvent = event;
    this.applyClientFilters();
  }

  private priceChange(event) {
    this.selectedPrice = event;
    this.applyClientFilters();
  }

  /** Rimuove dalla lista dei Trip gli item che soddisfano la condizione passata come argomento */
  private applyClientFilters() {
    const tempTrips: List<TripResponse> = this.storedTrips.copy();
    const dateCondition = trip => {
      return new Date(trip.departureDate) < new Date(this.getFilterDate()[0])
      || new Date(trip.departureDate) > new Date(this.getFilterDate()[1]);
    };
    const priceCondition = trip => trip.price > this.selectedPrice;
    tempTrips.remove(priceCondition);
    tempTrips.remove(dateCondition);
    this.allTrips = tempTrips.copy();
  }

  private gatherStringifyFilters(): SearchFilters {
    let departureCity = this.filtersFormGroup.get('departureCityPicker').value;
    let arrivalCity = this.filtersFormGroup.get('arrivalCityPicker').value;
    if (!departureCity && !arrivalCity) {
      return null;
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
    return filters;
  }

  private setAllTrips(data: any) {
    console.log(data);
    const castedData: List<TripResponse> = List.createFromArray<TripResponse>(data);
    if (data.length > 0) {
      const resultsMaxPrice = Math.max.apply(Math, data.map(t => t.price));
      this.maxPrice = resultsMaxPrice > 0 ? resultsMaxPrice : 500;
      this.selectedPrice = this.maxPrice;
    }
    this.storedTrips = castedData.copy();
    this.allTrips = this.storedTrips.copy();
    this.app.showSpinnerLoader = false;
  }

  private getFilterDate(): string[] {
    const time = this.changeTimeEvent !== undefined ? this.changeTimeEvent : this.filtersFormGroup.get('timePicker').value;
    const date = this.filtersFormGroup.get('datePicker').value;
    const formattedStartDate = this.app.shared.formatDate(date, time[0]);
    const formattedEndDate =  this.app.shared.formatDate(date, time[1]);
    return [formattedStartDate, formattedEndDate];
  }
}
