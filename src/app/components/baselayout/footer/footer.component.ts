import { Component, OnInit } from '@angular/core';
import { OnChanges, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, DoCheck {
  user: any;
  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.user = this.app.shared.models.userModel;
  }

  ngDoCheck() {
    this.user = this.app.shared.models.userModel;
  }

  changeVar() {

  }

}
