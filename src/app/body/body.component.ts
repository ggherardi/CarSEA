import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
  }

  insertCities() {
    this.app.shared.httpService.getResponse('php/cities.json').subscribe(res => this.getCitiesCallback(res));
  }

  private getCitiesCallback(res) {
    let i = 1;
    res.forEach(el => {
      const data = {
        action: 'insertCities',
        id_regione: el.id_regione,
        id_provincia: el.id_provincia,
        nome: el.nome,
        latitudine: el.latitudine,
        longitudine: el.longitudine
      };
      console.log('[' + i++ +  ']' + ' Inserting: ' + data.nome);
      this.app.shared.httpService.postResponse('php/CitiesServices.php', data, this.insertCitiesCallback.bind(this));
    });
    console.log(res);
  }

  private insertCitiesCallback(res) {
    console.log(res);
  }
}
