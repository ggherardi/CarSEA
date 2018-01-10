import { Component, OnInit } from '@angular/core';
import { PHPService } from '../_common/phpService';
import { Models } from '../_common/models';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  user: any;
  constructor(private phpService: PHPService, private models: Models) { }

  ngOnInit() {
    this.user = this.models.userModel;
  }

  changeVar() {

  }

}
