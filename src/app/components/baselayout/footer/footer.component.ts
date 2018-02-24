import { Component, OnInit } from '@angular/core';
import { OnChanges, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./footer.component.css?ver=${new Date().getTime()}']
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
