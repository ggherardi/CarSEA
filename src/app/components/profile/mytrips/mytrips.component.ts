import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-mytrips',
  templateUrl: './mytrips.component.html',
  styleUrls: ['./mytrips.component.css']
})
export class MytripsComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.app.shared.redirectIfNotLogged();
    this.populateControls();
  }

  populateControls() {
    this.app.api.getBookings(this.app.shared.models.userModel.UserID).subscribe(
      succ => console.log(succ),
      err => console.log(err)
    );
  }

}
