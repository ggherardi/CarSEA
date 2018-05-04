import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { ApiAutocompleteConfig } from '../../shared/apiautocomplete/apiautocomplete.component';
import { SearchFilters } from '../../../_services/models';

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

  /** Inizializza il form di ricerca Passaggi */
  private buildForm() {
    const date = new Date();
    const today = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.tripSearch = this.formBuilder.group({
      departureCityPicker: [''],
      arrivalCityPicker: [''],
      datePicker: [today]
    });
  }

  /** Recupera i Passaggi dal DB */
  private getTrips() {
    const filters = this.gatherStringifyFilters();
    if (!filters) {
      alert('Selezionare una città di partenza e una di arrivo');
      return;
    }
    this.app.shared.storage.searchFilters = filters;
    this.app.shared.router.navigateByUrl('findpassage');
  }

  /** Raccoglie i filtri per effettuarela ricerca */
  private gatherStringifyFilters(): SearchFilters {
    const departureCityObject = this.tripSearch.get('departureCityPicker').value;
    const arrivalCityObject = this.tripSearch.get('arrivalCityPicker').value;
    if (!departureCityObject && !arrivalCityObject) {
      return null;
    }
    const departureCityId = departureCityObject.id;
    const arrivalCityId = arrivalCityObject.id;

    const filters = new SearchFilters(
      departureCityId,
      arrivalCityId,
      1000,
      this.getFilterDate()[0],
      this.getFilterDate()[1],
      departureCityObject,
      arrivalCityObject
    );
    return filters;
  }

  private getFilterDate(): string[] {
    const date = this.tripSearch.get('datePicker').value;
    const formattedStartDate = this.app.shared.formatDate(date, 0);
    const formattedEndDate =  this.app.shared.formatDate(date, 24);
    return [formattedStartDate, formattedEndDate];
  }

}
