import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Trip } from '../../../_services/models';

@Component({
  selector: 'app-findpassage',
  templateUrl: './findpassage.component.html',
  styleUrls: ['./findpassage.component.css']
})
export class FindpassageComponent implements OnInit {
  allTrips: Trip[];

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

  private getTrip() {
    this.app.shared.post('php/tripservice.php', null).subscribe();
  }

}
