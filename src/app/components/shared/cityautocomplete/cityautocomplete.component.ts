import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { City } from '../../../_services/models';
import { AppComponent } from '../../../app.component';
import { FormBuilder, FormGroup, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-cityautocomplete',
  templateUrl: './cityautocomplete.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./cityautocomplete.component.css?ver=${new Date().getTime()}'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityautocompleteComponent),
      multi: true
    }
  ]
})
export class CityautocompleteComponent implements OnInit, ControlValueAccessor {
  value: any;
  @Input()
  valueChangedSender: string;
  @Input()
  placeholder: string;
  @Input()
  sourceList: any[];
  searchCities = (keyword: any): Observable<any[]> => {
    const serviceUrl = 'php/CitiesService.php';
    const data = {
      action: 'search',
      searchKey: keyword
    };
    return this.app.shared.post(serviceUrl, data);
  }
  propagateChange = (_: any) => {};

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {

  }

  autocompleListFormatter(data: City): string {
    return `${data['id_regione']} - ${data['value']}`;
  }

  autocompleteValueFormatter(data: City) {
    return data.value;
  }

  valueChangedEvent($event, sender) {
    this.propagateChange($event);
  }
}
