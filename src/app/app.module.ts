import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { enableProdMode} from '@angular/core';
import { HttpModule } from '@angular/http';
import { PHPService } from './common/api';
import { Cookies } from './common/cookies';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import * as $ from 'jquery';

// enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    PHPService,
    Cookies
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
