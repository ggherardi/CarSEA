import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { enableProdMode} from '@angular/core';
import { HttpModule } from '@angular/http';
import { PhpServiceComponent } from './common/api';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import * as $ from 'jquery';

// enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PhpServiceComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    PhpServiceComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
