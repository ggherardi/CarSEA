import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css']
})
export class PagenotfoundComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
    setTimeout(() => this.app.shared.router.navigateByUrl(''), 2000);
  }

}
