import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./body.component.css?ver=${new Date().getTime()}']
})
export class BodyComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

}
