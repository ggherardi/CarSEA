import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { FrequentTrip } from '../../../_services/models';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./adminpanel.component.css?ver=${new Date().getTime()}']
})
export class AdminpanelComponent implements OnInit {
  allMostFrequentTrips: FrequentTrip[] = [];

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.retrieveMostFrequentTrips();
  }

  retrieveMostFrequentTrips() {
    this.app.api.getMostFrequentTrips().subscribe(
      this.manageRetrieveMostFrequentTrips.bind(this),
      err => console.log(err)
    );
  }

  manageRetrieveMostFrequentTrips(res: FrequentTrip[]) {
    if (res.length > 0) {
      this.allMostFrequentTrips = res.sort((a, b) => {
        if (a.tripsCount > b.tripsCount) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  }
}
