import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { PHPService } from './_common/phpService';
import { Cookies } from './_common/cookies';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import * as $ from 'jquery';
import { BodyComponent } from './body/body.component';

// enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        component: BodyComponent
      },
      {
        path: 'test',
        component: HeaderComponent,
      },
      {
        path: '**',
        component: HeaderComponent
      }
    ], { enableTracing: true, useHash: true }
    )
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
