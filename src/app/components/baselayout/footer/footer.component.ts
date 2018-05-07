import { Component, OnInit } from '@angular/core';
import { OnChanges, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./footer.component.css?ver=${new Date().getTime()}']
})
export class FooterComponent implements OnInit {
  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

  download(file) {
    let filename = '';
    switch (file) {
      case 'richiesta':
      filename = 'Richiesta realizzazione Web Application.pdf';
      break;
    }
    this.app.shared.get(`/documentazione/${filename}`).subscribe();
  }

}
