import { Component, OnInit } from '@angular/core';
import { Models } from '../_common/models';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  user: any;
  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.user = this.app.models.userModel;
  }

  changeVar() {

  }

}
