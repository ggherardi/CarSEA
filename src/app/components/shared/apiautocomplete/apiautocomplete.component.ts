import { Component, OnInit, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { City } from '../../../_services/models';
import { AppComponent } from '../../../app.component';
import { FormBuilder, FormGroup, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-apiautocomplete',
  templateUrl: './apiautocomplete.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./apiautocomplete.component.css?ver=${new Date().getTime()}'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApiAutocompleteComponent),
      multi: true
    }
  ]
})
export class ApiAutocompleteComponent implements OnInit, ControlValueAccessor {
  value: any;
  @Input()
  config: ApiAutocompleteConfig = {};
  @Input()
  placeholder: string;
  @Input()
  sourceList: any[];
  @Output()
  valueChanged = new EventEmitter();
  searchCities = (keyword: any): Observable<any[]> => {
    const serviceUrl = this.config.apiUrl;
    const data = {
      searchKey: keyword,
      action: this.config.apiAction,
      param: this.config.apiParam
    };
    return this.app.shared.post(serviceUrl, data);
  }
  propagateChange = (_: any) => {};

  constructor(private app: AppComponent) {
    this.valueChanged.emit(this.value);
  }

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

  valueChangedEvent($event, sender) {
    this.valueChanged.emit($event);
    this.propagateChange($event);
  }
}

export class ApiAutocompleteConfig {
  apiAction?: string;
  apiParam?: any;
  apiUrl?: string;
  formattingFunction?: (data) => string;
  valueFormattingFunction?: (data) => string;
}
