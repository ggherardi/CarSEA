import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html?ver=${new Date().getTime()}',
  styleUrls: ['./adminpanel.component.css?ver=${new Date().getTime()}']
})
export class AdminpanelComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

  deleteCities() {
    this.app.shared.httpService.get('php/cities2.json').subscribe(res => this.insertCitiesCallback(res, 'deleteCities'));
  }

  insertCities() {
    this.app.shared.httpService.get('php/cities2.json').subscribe(res => this.insertCitiesCallback(res, 'insertCities'));
  }

  private insertCitiesCallback(res, action) {
    let i = 1;
    res.forEach(el => {
      const data = {
        action: action,
        id_regione: el.id_regione,
        id_provincia: el.id,
        nome: el.nome,
        latitudine: el.latitudine,
        longitudine: el.longitudine
      };
      console.log('[' + i++ +  ']' + action + ': ' + data.nome);
      this.app.shared.httpService.postAjax('php/CitiesServices.php', data, function(r){ console.log(r); });
    });
    console.log(res);
  }

}
