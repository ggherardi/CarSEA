import { Component, OnInit } from '@angular/core';
import { PHPService } from '../common/phpService';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private phpService: PHPService) { }

  ngOnInit() {
  }

  changeVar() {
  }

}
