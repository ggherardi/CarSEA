import { Component, OnInit, Input } from '@angular/core';
import { TripResponse } from '../../../_services/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tripabstract',
  templateUrl: './tripabstract.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./tripabstract.component.css?ver=${new Date().getTime()}']
})
export class TripabstractComponent implements OnInit {
  @Input()
  Trip: TripResponse;

  constructor() { }

  ngOnInit() {
    console.log(this.Trip.waypoints);
  }

}
