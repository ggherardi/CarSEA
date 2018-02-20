import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-personaldetails',
  templateUrl: './personaldetails.component.html',
  styleUrls: ['./personaldetails.component.css']
})
export class PersonaldetailsComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

}
