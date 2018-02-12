import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-pricechooser',
  templateUrl: './pricechooser.component.html',
  styleUrls: ['./pricechooser.component.css']
})
export class PricechooserComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
    if (this.app.shared.models.newTrip === undefined) {
      this.app.shared.router.navigateByUrl('/newtrip/pathChooser');
    }
    console.log(JSON.stringify(this.app.shared.models.newTrip));
  }

}
